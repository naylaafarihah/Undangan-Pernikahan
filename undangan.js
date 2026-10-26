document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.getElementById("mainContent");
    const cover = document.getElementById("cover");

    const bgMusic = document.getElementById("bgMusic");
    const musicBtn = document.getElementById("musicBtn");

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxClose = document.getElementById("lightboxClose");

    const wishForm = document.getElementById("wishForm");
    const wishesList = document.getElementById("wishesList");

    const guestName = document.getElementById("guestName");
    const params = new URLSearchParams(window.location.search);
    const guest = params.get("to") || params.get("nama");

    if (guestName && guest) {
        guestName.textContent = guest.replace(/\+/g, " ");
    }

    // BUKA UNDANGAN 
    window.openInvitation = function () {
        if (cover) {
            cover.classList.add("d-none");}
        if (mainContent) {
            mainContent.classList.remove("d-none");
        }
        if (musicBtn) {
            musicBtn.classList.remove("d-none");
        }
        // Memulai musik setelah tombol diklik
        if (bgMusic) {
            bgMusic.play()
                .then(function () {
                    updateMusicButton(true);
                })
                .catch(function () {
                    updateMusicButton(false);
                });
        }
        // Memulai dari atas
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // musik
    function updateMusicButton(isPlaying) {
        if (!musicBtn) return;
        musicBtn.classList.toggle("playing", isPlaying);
        musicBtn.setAttribute(
            "aria-label",
            isPlaying ? "Jeda musik" : "Putar musik"
        );
        musicBtn.title = isPlaying ? "Jeda musik" : "Putar musik";
        const icon = musicBtn.querySelector("i");
        if (icon) {
            icon.classList.toggle("bi-pause-fill", isPlaying);
            icon.classList.toggle("bi-music-note-beamed", !isPlaying);
        }
        const label = musicBtn.querySelector(".music-label");
        if (label) {
            label.textContent = isPlaying ? "Jeda Musik" : "Putar Musik";
        }
    }

    window.toggleMusic = function () {
        if (!bgMusic) {
            showToast("File musik tidak ditemukan.", "danger");
            return;
        }
        if (bgMusic.paused) {
            bgMusic.play()
                .then(function () {
                    updateMusicButton(true);
                })
                .catch(function () {
                    updateMusicButton(false);
                    showToast(
                        "Musik belum bisa diputar. Periksa file Sempurna.mp3.",
                        "warning"
                    );
                });
        } else {
            bgMusic.pause();
            updateMusicButton(false);
        }
    };

    if (bgMusic) {
        bgMusic.addEventListener("play", function () {
            updateMusicButton(true);
        });
        bgMusic.addEventListener("pause", function () {
            updateMusicButton(false);
        });
        bgMusic.addEventListener("ended", function () {
            updateMusicButton(false);
        });
    }

    function updateCountdown() {
        const weddingDate = new Date("2030-02-14T08:00:00+07:00");
        const now = new Date();
        const difference = weddingDate.getTime() - now.getTime();

        const daysElement = document.getElementById("days");
        const hoursElement = document.getElementById("hours");
        const minutesElement = document.getElementById("minutes");
        const secondsElement = document.getElementById("seconds");

        if (!daysElement || !hoursElement ||
            !minutesElement || !secondsElement) {
            return;
        }
        if (difference <= 0) {
            daysElement.textContent = "0";
            hoursElement.textContent = "0";
            minutesElement.textContent = "0";
            secondsElement.textContent = "0";
            return;
        }
        const days = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );
        const hours = Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );
        const minutes = Math.floor(
            (difference / (1000 * 60)) % 60
        );
        const seconds = Math.floor(
            (difference / 1000) % 60
        );
        daysElement.textContent = days;
        hoursElement.textContent = String(hours).padStart(2, "0");
        minutesElement.textContent = String(minutes).padStart(2, "0");
        secondsElement.textContent = String(seconds).padStart(2, "0");
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    window.copyText = async function (text, button) {
        try {
            await navigator.clipboard.writeText(text);
            if (button) {
                const originalText = button.textContent;
                button.textContent = "Berhasil Disalin!";
                setTimeout(function () {
                    button.textContent = originalText;
                }, 2000);
            }
            showToast("Berhasil disalin ke clipboard!", "success");
        } catch (error) {
            // Cara alternatif jika Clipboard API tidak tersedia.
            const temporaryInput = document.createElement("textarea");

            temporaryInput.value = text;
            temporaryInput.style.position = "fixed";
            temporaryInput.style.opacity = "0";

            document.body.appendChild(temporaryInput);
            temporaryInput.select();

            try {
                const copied = document.execCommand("copy");

                if (!copied) {
                    throw new Error("Penyalinan gagal");
                }

                showToast("Berhasil disalin!", "success");
            } catch (copyError) {
                window.prompt("Salin teks berikut:", text);
            }

            temporaryInput.remove();
        }
    };

    // ==================== GALERI FOTO ====================
    const galleryButtons = document.querySelectorAll(
        "[data-gallery-image]"
    );

    galleryButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const imageSource = button.getAttribute("data-gallery-image");

            if (!imageSource || !lightbox || !lightboxImg) {
                return;
            }

            lightboxImg.src = imageSource;
            lightboxImg.alt = "Foto galeri Bagas dan Nazwa";

            lightbox.classList.remove("d-none");
            document.body.style.overflow = "hidden";
        });
    });

    function closeLightbox() {
        if (!lightbox) return;

        lightbox.classList.add("d-none");
        document.body.style.overflow = "";

        if (lightboxImg) {
            lightboxImg.src = "";
        }
    }

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeLightbox();
        }
    });

    // ==================== UCAPAN & KEHADIRAN ====================
    const STORAGE_KEY = "ucapanUndanganBagasNazwa";

    function getWishes() {
        try {
            const savedWishes = localStorage.getItem(STORAGE_KEY);
            return savedWishes ? JSON.parse(savedWishes) : [];
        } catch (error) {
            return [];
        }
    }

    function saveWishes(wishes) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(wishes)
            );

            return true;
        } catch (error) {
            showToast(
                "Ucapan tidak dapat disimpan di browser ini.",
                "danger"
            );

            return false;
        }
    }

    function renderWishes() {
        if (!wishesList) return;

        const wishes = getWishes();

        wishesList.replaceChildren();

        if (wishes.length === 0) {
            const emptyMessage = document.createElement("p");

            emptyMessage.className =
                "text-center text-muted py-3";

            emptyMessage.textContent =
                "Belum ada ucapan. Jadilah yang pertama memberikan doa!";

            wishesList.appendChild(emptyMessage);
            return;
        }

        // Ucapan terbaru ditampilkan terlebih dahulu.
        wishes.slice().reverse().forEach(function (wish) {
            const item = document.createElement("div");
            item.className = "wish-item";

            const name = document.createElement("h4");
            name.textContent = wish.name;

            const attendance = document.createElement("small");
            attendance.textContent =
                "Kehadiran: " + wish.attendance;

            const message = document.createElement("p");
            message.textContent = wish.message;

            const date = document.createElement("small");
            date.textContent = wish.date;

            item.appendChild(name);
            item.appendChild(attendance);
            item.appendChild(message);
            item.appendChild(document.createElement("br"));
            item.appendChild(date);

            wishesList.appendChild(item);
        });
    }

    if (wishForm) {
        wishForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const nameInput = document.getElementById("wishName");
            const attendanceInput =
                document.getElementById("wishAttend");
            const messageInput =
                document.getElementById("wishMessage");

            if (!nameInput || !attendanceInput || !messageInput) {
                showToast(
                    "Form ucapan tidak ditemukan dengan benar.",
                    "danger"
                );
                return;
            }

            const name = nameInput.value.trim();
            const attendance = attendanceInput.value;
            const message = messageInput.value.trim();

            if (!name || !attendance || !message) {
                showToast(
                    "Silakan lengkapi semua kolom terlebih dahulu.",
                    "warning"
                );
                return;
            }

            const newWish = {
                name: name,
                attendance: attendance,
                message: message,
                date: new Date().toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short"
                })
            };

            const wishes = getWishes();
            wishes.push(newWish);

            if (saveWishes(wishes)) {
                renderWishes();
                wishForm.reset();

                showToast(
                    "Terima kasih atas ucapan dan doanya!",
                    "success"
                );
            }
        });
    }

    renderWishes();

    // ==================== NOTIFIKASI TOAST ====================
    function showToast(message, type) {
        const toastContainer =
            document.getElementById("toastContainer");

        if (!toastContainer) {
            alert(message);
            return;
        }

        const toast = document.createElement("div");

        toast.className =
            "alert alert-" + (type || "success") +
            " shadow-sm mb-2";

        toast.setAttribute("role", "status");
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(function () {
            toast.remove();
        }, 3000);
    }
});
