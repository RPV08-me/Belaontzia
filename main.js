document.addEventListener('DOMContentLoaded', function() {
    
    const modal = document.getElementById('modal');
    const successModal = document.getElementById('successModal');
    const closeSpan = document.querySelector('.close');
    const closeSuccess = document.querySelector('.close-success');
    let countdownInterval = null;
    
    function openModal() { 
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    function closeModal() { 
        if (modal) modal.style.display = 'none'; 
    }
    
    function openSuccessModal() { 
        if (successModal) {
            successModal.style.display = 'flex';
            startCountdown(); 
        }
    }
    
    function closeSuccessModal() { 
        if (successModal) {
            successModal.style.display = 'none';
            stopCountdown(); 
        }
    }
    
    function startCountdown() {
        let seconds = 10;
        const timerSpan = document.getElementById('countdownTimer');
        if (!timerSpan) return;
        timerSpan.textContent = seconds;
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            seconds--;
            if (timerSpan) {
                timerSpan.textContent = seconds;
            }
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
                window.location.href = 'main.html';
            }
        }, 1000);
    }
    
    function stopCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }
    
    function initModalButtons() {
        const bookBtns = document.querySelectorAll('.book-btn, .button-container button');
        
        bookBtns.forEach(function(btn, index) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Клик по кнопке Забронировать', index);
                openModal();
            });
        });
    }
    
    initModalButtons();
    
    const observer = new MutationObserver(function() {
        initModalButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    if (closeSpan) {
        closeSpan.addEventListener('click', closeModal);
    }
    if (closeSuccess) {
        closeSuccess.addEventListener('click', function() {
            stopCountdown();
            closeSuccessModal();
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target == modal) closeModal();
        if (e.target == successModal) {
            stopCountdown();
            closeSuccessModal();
        }
    });
    
    const start = document.getElementById('start');
    const end = document.getElementById('end');
    const yachtSelect = document.getElementById('yacht');
    const sum = document.getElementById('sum');
    
    function calc() {
        if (start && end && yachtSelect && sum) {
            const s = new Date(start.value);
            const e = new Date(end.value);
            const days = (s && e && e > s) ? Math.ceil((e - s) / 86400000) : 0;
            const price = parseInt(yachtSelect.value) || 0;
            sum.innerText = days * price;
        }
    }
    
    if (start) start.addEventListener('change', calc);
    if (end) end.addEventListener('change', calc);
    if (yachtSelect) yachtSelect.addEventListener('change', calc);
    
    const today = new Date().toISOString().split('T')[0];
    if (start) start.min = today;
    if (end) end.min = today;
    
    function showError(fieldId, message) {
        const errorDiv = document.getElementById(fieldId);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
            setTimeout(() => {
                errorDiv.classList.remove('show');
            }, 3000);
        }
    }
    
    function clearErrors() {
        const allErrors = document.querySelectorAll('.error-msg');
        allErrors.forEach(error => {
            error.classList.remove('show');
            error.textContent = '';
        });
    }
    
    function validateForm() {
        let isValid = true;
        clearErrors();
        
        const fio = document.getElementById('fio');
        if (!fio.value.trim()) {
            showError('fioError', '🛥️ Пожалуйста, укажите ваше ФИО');
            isValid = false;
        } else if (fio.value.trim().length < 10) {
            showError('fioError', '🛥️ ФИО должно содержать хотя бы 10 символов');
            isValid = false;
        }
        
        const yachtSel = document.getElementById('yacht');
        if (!yachtSel.value || yachtSel.value === 'Яхта') {
            showError('yachtError', '🚢 Выберите яхту из списка');
            isValid = false;
        }
        
        const startDate = document.getElementById('start');
        const endDate = document.getElementById('end');
        
        if (!startDate.value) {
            showError('dateError', '⚓ Укажите дату начала аренды');
            isValid = false;
        } else if (!endDate.value) {
            showError('dateError', '🛟 Укажите дату окончания аренды');
            isValid = false;
        } else {
            const s = new Date(startDate.value);
            const e = new Date(endDate.value);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            
            if (e <= s) {
                showError('dateError', '🛞 Дата окончания должна быть позже даты начала');
                isValid = false;
            } else if (s < todayDate) {
                showError('dateError', 'Дата не может быть в прошлом');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    const sendBtn = document.getElementById('send');
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            if (!validateForm()) return;
    
            const fio = document.getElementById('fio');
            const startDate = document.getElementById('start');
            const endDate = document.getElementById('end');
            const yachtSel = document.getElementById('yacht');
            
            closeModal();
            openSuccessModal();
            
            fio.value = '';
            startDate.value = '';
            endDate.value = '';
            if (yachtSel) yachtSel.value = 'Яхта';
            if (sum) sum.innerText = '0';
        });
    }
    
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    function filterYachts() {
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        console.log('Поиск:', searchTerm);
        
        const yatch1Img = document.querySelector('.yatch1');
        const yatch11_1 = document.querySelectorAll('.yatch11')[0];
        const yatch2Img = document.querySelector('.yatch2');
        const yatch11_2 = document.querySelectorAll('.yatch11')[1];
        const yatch3Img = document.querySelector('.yatch3');
        const yatch11_3 = document.querySelectorAll('.yatch11')[2];
        
        const yachts = [
            { img: yatch1Img, info: yatch11_1, name: 'Мария', keywords: ['мария', 'яхта мария', 'моторная', '40 метров'] },
            { img: yatch2Img, info: yatch11_2, name: 'Солнечная', keywords: ['солнечная', 'яхта солнечная', 'современная', '35 метров'] },
            { img: yatch3Img, info: yatch11_3, name: 'Прекрасная', keywords: ['прекрасная', 'яхта прекрасная', 'скоростная', '30 метров'] }
        ];
        
        if (searchTerm === '') {
            yachts.forEach(function(yacht) {
                if (yacht.img) yacht.img.style.display = '';
                if (yacht.info) yacht.info.style.display = '';
            });
            return;
        }
        
        yachts.forEach(function(yacht) {
            let matches = yacht.name.toLowerCase().includes(searchTerm);
            if (!matches) {
                matches = yacht.keywords.some(function(keyword) {
                    return keyword.toLowerCase().includes(searchTerm);
                });
            }
            
            if (matches) {
                if (yacht.img) yacht.img.style.display = '';
                if (yacht.info) yacht.info.style.display = '';
            } else {
                if (yacht.img) yacht.img.style.display = 'none';
                if (yacht.info) yacht.info.style.display = 'none';
            }
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', filterYachts);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterYachts();
            }
        });
    }
    
    const activityModal = document.getElementById('activityModal');
    let activityTimer = null;
    let isActivityModalOpen = false;
    
    function openActivityModal() {
        if (activityModal && !isActivityModalOpen) {
            activityModal.style.display = 'flex';
            isActivityModalOpen = true;
            console.log('Модалка активности открыта');
        }
    }
    
    function closeActivityModal() {
        if (activityModal) {
            activityModal.style.display = 'none';
            isActivityModalOpen = false;
        }
        resetActivityTimer();
    }
    
    function resetActivityTimer() {
        if (activityTimer) clearTimeout(activityTimer);
        activityTimer = setTimeout(openActivityModal, 10000);
    }
    
    function handleUserActivity() {
        if (isActivityModalOpen) {
            closeActivityModal();
        } else {
            resetActivityTimer();
        }
    }
    
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'click', 'touchstart'];
    activityEvents.forEach(function(event) {
        document.addEventListener(event, handleUserActivity);
    });
    
    if (activityModal) {
        activityModal.addEventListener('click', function(e) {
            if (e.target === activityModal) closeActivityModal();
        });
    }
    
    resetActivityTimer();
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (activityTimer) clearTimeout(activityTimer);
        } else {
            if (!isActivityModalOpen) resetActivityTimer();
        }
    });
    
    const offlineModal = document.getElementById('offlineModal');
    
    window.addEventListener('offline', function() {
        if (offlineModal) {
            offlineModal.style.display = 'flex';
        }
    });
    
    window.addEventListener('online', function() {
        if (offlineModal) {
            offlineModal.style.display = 'none';
        }
    });
    
    if (navigator.onLine === false) {
        if (offlineModal) offlineModal.style.display = 'flex';
    }
    
    let clickCount = 0;
    let clickTimeout = null;
    let lastClickX = 0;
    let lastClickY = 0;
    
    function goToErrorPage() {
        const currentPage = window.location.href;
        sessionStorage.setItem('previousPage', currentPage);
        window.location.href = 'error.html';
    }
    
    function resetClickCount() {
        clickCount = 0;
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
        }
    }
    
    document.addEventListener('click', function(e) {
        const currentX = e.clientX;
        const currentY = e.clientY;
        
        if (lastClickX !== currentX || lastClickY !== currentY) {
            if (clickCount > 0 && clickCount < 4) {
                resetClickCount();
            }
        }
        
        lastClickX = currentX;
        lastClickY = currentY;
        clickCount++;
        
        if (clickCount === 4) {
            goToErrorPage();
            resetClickCount();
            return;
        }
        
        if (clickTimeout) clearTimeout(clickTimeout);
        clickTimeout = setTimeout(resetClickCount, 1000);
    });
    
    if (window.location.pathname.includes('error.html')) {
        setTimeout(function() {
            const previousPage = sessionStorage.getItem('previousPage');
            if (previousPage) {
                sessionStorage.removeItem('previousPage');
                window.location.href = previousPage;
            } else {
                window.location.href = 'main.html';
            }
        }, 10000);
    }
});

const titleElement = document.querySelector('h1');
    
    function createConfetti() {
        const colors = ['#97BDE1', '#026EB7', '#0000ff', '#A3B3CB', '#213572', '#00ffff', '#E4EBF1', '#213572'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-20px';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.zIndex = '10000';
            confetti.style.pointerEvents = 'none';
            confetti.style.opacity = '1';
            
            document.body.appendChild(confetti);
            
            const duration = Math.random() * 2000 + 1000;
            const startTime = performance.now();
            
            function animateConfetti(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    const y = -20 + progress * (window.innerHeight + 50);
                    const x = parseFloat(confetti.style.left) + Math.sin(progress * Math.PI * 4) * 30;
                    confetti.style.top = y + 'px';
                    confetti.style.left = x + 'px';
                    confetti.style.opacity = 1 - progress;
                    confetti.style.transform = `rotate(${progress * 720}deg)`;
                    requestAnimationFrame(animateConfetti);
                } else {
                    confetti.remove();
                }
            }
            
            requestAnimationFrame(animateConfetti);
        }
    }
    
    if (titleElement) {
        titleElement.style.cursor = 'pointer';
        titleElement.addEventListener('click', createConfetti);
    }