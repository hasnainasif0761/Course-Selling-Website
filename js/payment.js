class PaymentSystem {
    constructor() {
        this.courses = JSON.parse(localStorage.getItem('courses')) || [];
        this.purchases = JSON.parse(localStorage.getItem('purchaseCourses')) || [];
        this.currentCourse = null;
        this.init();
    }

    init(){
        this.loadCourseDetails();
        this.setUpPaymentModal();
        this.setUpForm();
    }

    loadCourseDetails(){
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = parseInt(urlParams.get('id'));

        this.currentCourse = this.courses.find(course => course.id === courseId);

        if(!this.currentCourse){
            alert('Course not found!');
            window.location.href = 'index.html';
            return;
        }

        this.displayCourseDetails();
        this.checkAccess();
    }

    displayCourseDetails(){
        const container = document.getElementById('courseDetails');
        if(!container) return;

        container.innerHTML = `
        <div class="course-details-image">
            <img src="${this.currentCourse.image}" alt="${this.currentCourse.title}">
        </div>
        <div class="course-details-info">
            <h2>${this.currentCourse.title}</h2>
            <p class="course-details-price">$${this.currentCourse.price}</p>
            <p class="course-details-description">${this.currentCourse.description}</p>
            <button class="btn btn-purchase" onclick="paymentSystem.showPaymentModal()">
            <i class="fas fa-lock-open"></i> Enroll Now
            </button>
        </div>
            `
    }

    checkAccess(){
        const hasAccess = this.purchases.includes(this.currentCourse.id);
        if(hasAccess){
            this.unlockCourse()
        }
    }

    setUpPaymentModal(){
        const modal = document.getElementById('paymentModal');
        const closeBtn = modal.querySelector('.close');

        if(closeBtn){
            closeBtn.addEventListener('click',()=>{
                modal.style.display = 'none';
             });
        }
        window.addEventListener('click',(e)=>{
            if(e.target === modal){
                modal.style.display = 'none';
            };
        }); 
    }

    showPaymentModal(){
        const modal = document.getElementById('paymentModal');
        const summary = document.getElementById('courseSummary');

        summary.innerHTML = `
        <h4>${this.currentCourse.title}</h4>
        <p>Price: $${this.currentCourse.price}</p>
        `
        modal.style.display = 'block';
    }
    setUpForm(){
        const form = document.getElementById('paymentForm');
        if(!form) return;

        document.getElementById('cardNumber').addEventListener('input',(e)=>{
            let value = e.target.value.replace(/\D/g,'');
            value = value.replace(/(\d{4})(?=\d)/g,'$1 ');
            e.target.value = value;
        })

        document.getElementById('expiryDate').addEventListener('input',(e)=>{
            let value = e.target.value.replace(/\D/g,'');
            if(value.length >= 2){
                value = value.slice(0,2) + '/' + value.slice(2);
            }
            e.target.value = value;
        })
        form.addEventListener('submit',(e)=>{
            e.preventDefault();
            this.processPayment();
        });
    }

    processPayment(){
        const submitBtn = document.querySelector('#paymentforms .btn-primary');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;
        submitBtn.disabled = true;

        setTimeout(()=>{
            const paymentSuccess = this.validPaymentDetails();

            if(paymentSuccess){
                if(!this.purchases.includes(this.currentCourse.id)){
                    this.purchases.push(this.currentCourse.id);
                    localStorage.setItem('purchaseCourses', JSON.stringify(this.purchases));
                }
                document.getElementById('paymentModal').style.display = 'none';

                this.showNotification('Payment Successful! Course Unlocked.', 'success');

                this.unlockCourse();
            }else{
                this.showNotification('Please fill in all payment details (demo mode)', 'error');
            }
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        },1500);
    }
    validPaymentDetails(){
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        const name = document.getElementById('cardholderName').value.trim();
        const email = document.getElementById('email').value.trim();

        return cardNumber && expiryDate && cvv && name && email;
    }

    unlockCourse(){
     const unlockedContent = document.getElementById('unlockedContent');
     const purchaseBtn = document.querySelector('.btn-purchase');
        if(unlockedContent){
            unlockedContent.style.display = 'block';
            this.displayCourseContent();
        }
        if(purchaseBtn){
            purchaseBtn.style.display = 'none';
        }
    }

    displayCourseContent(){
        const container = document.getElementById('unloackedContent');

        let chaptersHtml = '';
        if(this.currentCourse.chapters && this.currentCourse.chapters.length > 0){
            chaptersHtml = this.currentCourse.chapters.map((chapter, index) => `
            <div class="course-chapter">
            <div class="chapter-header" onclick="paymentSystem.toggleChapter(${index})">
             <span>${chapter.title}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="chapter-content" id="chapter-${index}">
                <div class="video-container">
                <iframe src="${chapter.video}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
            </div>
            `).join('');
        }else{
            chaptersHtml = '<p>No Chapter Available yet.</p>';
        }
        container.innerHTML = `
        <h2>Course Content</h2>
        <div class="course-content">
        ${chaptersHtml}
        </div>
        `;
    }
    toggleChapter(index){
        const content = document.getElementById(`chapter-${index}`);
        const header = content.previousElementSibling;

        if(content.classList.contains('active')){
            content.classList.remove('active');
            header.classList.remove('active');
        }else{
            content.classList.add('active');
            header.classList.add('active');
        }
    }
    showNotification(message, type){ 
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        `;
        notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: #fff;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1002;
        animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        },3000);
    }
}

const paymentSystem = new PaymentSystem();