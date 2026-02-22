let courses = JSON.parse(localStorage.getItem('courses')) || [];
let purchases = JSON.parse(localStorage.getItem('purchases')) || [];
let currentCourse = null;

window.onload = function(){
    loadCourseDetails();
    setUpPaymentModal();
    setUpForm();
}

// Load current course
function loadCourseDetails(){
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id'));

    currentCourse = courses.find(c => Number(c.id) === courseId);

    if(!currentCourse){
        alert('Course not found!');
        window.location.href = 'index.html';
        return;
    }

    displayCoursesDetails();
    checkAccess();
}

// Show course info
function displayCoursesDetails(){
    const container = document.getElementById('courseDetails');
    if(!container) return;

    container.innerHTML = `
    <div class="course-details-image">
        <img src="${currentCourse.image}" alt="${currentCourse.title}">
    </div>
    <div class="course-details-info">
        <h2>${currentCourse.title}</h2>
        <p class="course-details-price">$${currentCourse.price}</p>
        <p class="course-details-description">${currentCourse.description}</p>
        <button class="btn btn-purchase" onclick="showPaymentModal()">
            <i class="fas fa-lock-open"></i> Enroll Now
        </button>
    </div>
    `;
}

function checkAccess(){
    if(purchases.includes(Number(currentCourse.id))){
        unlockCourse();
    }
}

// Payment modal setup
function setUpPaymentModal(){
    const modal = document.getElementById('paymentModal');
    if(!modal) return;

    const closeBtn = modal.querySelector('.close');
    if(closeBtn) closeBtn.addEventListener('click', ()=> modal.style.display = 'none');

    window.addEventListener('click', (e)=>{
        if(e.target === modal) modal.style.display = 'none';
    });
}

// Show payment modal
function showPaymentModal(){
    const modal = document.getElementById('paymentModal');
    const summary = document.getElementById('courseSummary');
    summary.innerHTML = `<h4>${currentCourse.title}</h4><p>Price: $${currentCourse.price}</p>`;
    modal.style.display = 'block';
}

// Setup Pay Now button
function setUpForm(){
    const payBtn = document.getElementById('payNowBtn');
    if(!payBtn) return;

    payBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        processPayment();
    });
}

// Payment logic
function processPayment(){
    const submitBtn = document.getElementById('payNowBtn');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    setTimeout(()=>{
        if(validPaymentDetails()){
            if(!purchases.includes(Number(currentCourse.id))){
                purchases.push(Number(currentCourse.id));
                localStorage.setItem('purchases', JSON.stringify(purchases));
            }
            document.getElementById('paymentModal').style.display = 'none';
            unlockCourse();
            alert('Payment Successful!');
        } else {
            alert('Please fill all details correctly!');
        }
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Payment validation
function validPaymentDetails(){
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const expiryDate = document.getElementById('expiryDate').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const name = document.getElementById('cardholderName').value.trim();
    const email = document.getElementById('email').value.trim();
    return cardNumber && expiryDate && cvv && name && email;
}

// Unlock course content
function unlockCourse(){
    const unlockedContent = document.getElementById('unlockContent');
    const purchaseBtn = document.querySelector('.btn-purchase');

    if(unlockedContent){
        unlockedContent.style.display = 'block';
        displayCourseContent();
    }
    if(purchaseBtn) purchaseBtn.style.display = 'none';
}

// Display chapters and video
function displayCourseContent(){
    const container = document.getElementById('unlockContent');
    if(!container) return;

    if(currentCourse.chapters && currentCourse.chapters.length > 0){
        container.innerHTML = currentCourse.chapters.map((chapter, idx)=>`
        <div class="course-chapter">
            <div class="chapter-header" onclick="toggleChapter(${idx})">
                <span>${chapter.title}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="chapter-content" id="chapter-${idx}">
                <div class="video-container">
                    <iframe src="${chapter.video}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        </div>
        `).join('');
    } else {
        container.innerHTML = '<p>No chapters available.</p>';
    }
}

// Toggle chapter open/close
function toggleChapter(idx){
    const content = document.getElementById(`chapter-${idx}`);
    if(!content) return;
    content.classList.toggle('active');

    const header = content.previousElementSibling;
    if(header) header.classList.toggle('active');
}