class AdminPanel{
    constructor(){
        this.checkDirectAccess();

        if(!this.checkAuth()){
            this.showLoginForm();
            return
        }

        this.courses = JSON.parse(localStorage.getItem('courses')) || [];
        this.init();
    }
    checkDirectAccess(){
        const path = window.location.pathname;
        const isAdminPage = path.includes('admin.html') || path.endsWith('admin/');

        console.log('Amin Page Access Directly')
    }
    checkAuth(){
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated') == 'true';

        const urlParams = new URLSearchParams(window.location.search);
        const adminKey = urlParams.get('admin');

        const SECRET_PASSWORD = 'huzaifa0761';

        if(adminKey === SECRET_PASSWORD){
            sessionStorage.setItem('adminAuthenticated', 'true');
            const url = new URL(window.location);
            url.searchParams.delete('admin');
            window.history.replaceState({}, '', url);
            return true;
        }
        return isAuthenticated;
    }
    showLoginForm(){
        const mainContext = document.querySelector('.admin-main');
        
        if(!mainContext) return;

        mainContext.innerHTML = `
        <!-- ADMIN.JS -->
       <div class="login-container" style="
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 70vh;
                animation: fadeIn 0.6s ease;
                margin: 2rem 0;
            ">
                <div class="login-box" style="
                    background: white;
                    padding: 3rem;
                    border-radius: 15px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 400px;
                    text-align: center;
                ">
                    <div style="margin-bottom: 2rem;">
                        <i class="fas fa-lock" style="
                            font-size: 3rem;
                            color: #667eea;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                        "></i>
                        <h2 style="
                            color: #333;
                            font-size: 1.8rem;
                        ">Admin Access</h2>
                        <p style="color: #666; margin-bottom: 1rem;">Enter password to access admin panel</p>
                        <div class="demo-credentials" style="
                            background: #f8f9fa;
                            padding: 1rem;
                            border-radius: 8px;
                            margin: 1rem 0;
                            font-size: 0.9rem;
                        ">
                            <p><strong>Demo Password:</strong> admin123</p>
                            <p style="color: #666; margin-top: 0.5rem;">
                                <i class="fas fa-info-circle"></i> 
                                Quick access: admin.html?admin=admin123
                            </p>
                        </div>
                    </div>
                    
                    <form id="loginForm" style="text-align: left;">
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label for="password" style="
                                display: block;
                                margin-bottom: 0.5rem;
                                font-weight: 500;
                                color: #333;
                            ">Password</label>
                            <input type="password" id="password" placeholder="Enter admin password" style="
                                width: 100%;
                                padding: 1rem;
                                border: 2px solid #e0e0e0;
                                border-radius: 8px;
                                font-family: inherit;
                                transition: all 0.3s ease;
                                font-size: 1rem;
                            " required>
                        </div>
                        
                        <button type="submit" style="
                            width: 100%;
                            padding: 1rem;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 1.1rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                        ">
                            <i class="fas fa-sign-in-alt"></i>
                            Login to Admin Panel
                        </button>
                    </form>
                    
                    <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e0e0e0;">
                        <a href="index.html" style="
                            color: #667eea;
                            text-decoration: none;
                            font-size: 0.9rem;
                            display: inline-flex;
                            align-items: center;
                            gap: 5px;
                        ">
                            <i class="fas fa-arrow-left"></i>
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>
        `;

        this.setUpLoginForm();
    }

    setUpLoginForm(){
        const form = document.getElementById('loginForm');
        if(!form) return;

        form.addEventListener('submit',(e)=>{
            e.preventDefault();

            const password = document.getElementById('password').value;
            const SECRET_PASSWORD = 'huzaifa0761';

            if(password === SECRET_PASSWORD){
                sessionStorage.setItem('adminAuthenticated', 'true');
                
                this.showNotification('Login successful! Redirecting...', 'success');

                setTimeout(()=>{
                    window.location.href = 'admin.html';
                },1500);
            }else{
                this.showNotification('Incorrect password. Please try again.', 'error');

                const loginBox = document.querySelector('.login-box');
                loginBox.style.animation = 'shake 0.5s ease';
                setTimeout(()=>{
                    loginBox.style.animation = '';
                },500)
            }
        });
    }

    init(){
        this.setUpForm();
        this.loadCourses();
        this.setUpNavigation();
        this.setUpLogout();
        this.updateDashboardStats();
    }

    setUpForm(){
        const form = document.getElementById('courseForm');
        if(!form) return;

        form.addEventListener('submit',(e)=>{
            e.preventDefault();

            const newCourse = {
                id: Date.now(),
                title: document.getElementById('courseTitle').value,
                description: document.getElementById('courseDescription').value,
                price: parseFloat(document.getElementById('coursePrice').value),
                category: document.getElementById('courseCategory').value,
                image: document.getElementById('courseUrl').value,
                VideoUrl: document.getElementById('videoUrl').value,
                chapters: this.parseChapters(document.getElementById('courseContent').value),
                createdAt: new Date().toLocaleString()
            };

            this.courses.push(newCourse);
            localStorage.setItem('courses', JSON.stringify(this.courses));

            form.reset();
            this.loadCourses();
            this.updateDashboardStats();
            this.showNotification('Course added successfully!', 'success');
        })
    }
    parseChapters(content){
    try {
        return JSON.parse(content);
    } catch (error) {
        return [{"title": "Sample Chapters", "video": "url"}];
    }
    }
    loadCourses(){
        const container = document.getElementById('adminCoursesList');
        if(!container) return;

        if(this.courses.length === 0){
            container.innerHTML = `<p style="color: #666; text-align: center;border-radius:10px ;padding: 3rem;">
            <i class="fas fa-book-open" style="color: #667eea; font-size:3rem"></i>
            No courses available. Please add some courses.</p>`;
            return;
        }
        container.innerHTML = this.courses.map((course)=>`
                <div class="admin-course-item" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 8px;
                margin-bottom: 1rem;
                transition: all 0.3s ease;
                animation: fadeInUp 0.5s ease;
            ">
                <div class="admin-course-info" style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${course.image}" alt="${course.title}" style="
                        width: 60px;
                        height: 60px;
                        object-fit: cover;
                        border-radius: 8px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    ">
                    <div>
                        <h4 style="margin-bottom: 0.3rem; color: #333;">${course.title}</h4>
                        <p style="color: #666; font-size: 0.9rem;">
                            <span style="color: #667eea; font-weight: 600;">$${course.price}</span> • 
                            <span style="text-transform: capitalize;">${course.category}</span>
                        </p>
                        <p style="color: #999; font-size: 0.8rem;">
                            <i class="far fa-clock"></i> 
                            Added: ${new Date(courses.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div class="admin-course-actions" style="display: flex; gap: 0.5rem;">
                    <button onclick="adminPanel.editCourse(${course.id})" class="btn-edit" style="
                        padding: 0.5rem 1rem;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    ">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button onclick="adminPanel.deleteCourse(${courses.id})" class="btn-delete" style="
                        padding: 0.5rem 1rem;
                        background: #f44336;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    ">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>

        `).join('');
    }
    updateDashboardStats(){
        const totalCoursesEle = document.getElementById('totalCourses');
        const totalRevenueEle = document.getElementById('totalRevenue');
        const totalStudentsEle = document.getElementById('totalStudents');

        if(totalCoursesEle){
            totalCoursesEle.textContent = this.courses.length;
        }
        if(totalRevenueEle){
            const totalRevenue = this.courses.reduce((sum, course) => sum + course.price, 0);
            totalRevenueEle.textContent = `$${totalRevenue.toFixed(2)}`;
        }
        if(totalStudentsEle){
            const purchases = JSON.parse(localStorage.getItem('purchasedCourses')) || [];
            totalStudentsEle.textContent = purchases.length;
        }
    }

    deleteCourse(id){
        if(confirm('Are you sure you want to delete this course?')){
            this.courses = this.courses.filter(course => course.id !== id); 
            localStorage.setItem('courses', JSON.stringify(this.courses));
            this.loadCourses();
            this.updateDashboardStats();
            this.showNotification('Course deleted successfully!', 'success');
        } 
    }

    editCourse(id){
        const course = this.courses.find(c => c.id === id);
        if(!course) return;

        document.getElementById('courseTitle').value = course.title;
        document.getElementById('courseDescription').value = course.description;
        document.getElementById('coursePrice').value = course.price;
        document.getElementById('courseCategory').value = course.category;
        document.getElementById('courseUrl').value = course.image;
        document.getElementById('videoUrl').value = course.chapters[0].video || '';
        document.getElementById('courseContent').value = JSON.stringify(course.chapters, null, 2);

        document.getElementById('addCourses').scrollIntoView({behavior: 'smooth'});

        const submitBtn = document.querySelector('#courseForm button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Course';

        this.courses = this.courses.filter(c => c.id !== id);
    }

    setUpNavigation(){
        const navLinks = document.querySelectorAll('.admin-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e)=>{
                e.preventDefault();
            
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if(targetSection){
                    targetSection.scrollIntoView({behavior: 'smooth'});
                }
            });
        });
    }
    setUpLogout(){
    
        const adminHeader = document.querySelector('.admin-header');
        if(adminHeader && !document.getElementById('logoutBtn')){
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logoutBtn';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
            logoutBtn.style.cssText = `
            background: #f44336;
            color: white;
            border: none;
            padding: 0.5rem 1.5rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            margin-left: 1rem;
            `;

            logoutBtn.addEventListener('mouseenter', ()=>{
                logoutBtn.style.background = '#d32f2f';
                logoutBtn.style.transform = 'translateY(-2px)';
            })

            logoutBtn.addEventListener('mouseleave', ()=>{
                logoutBtn.style.background = '#f44336';
                logoutBtn.style.transform = 'translateY(0)';
            })

            logoutBtn.addEventListener('click', ()=>{
                this.logout();
            })
            adminHeader.querySelector('.admin-user').appendChild(logoutBtn);
        }
    }

    logout(){
        sessionStorage.removeItem('adminAuthenticated');
        this.showNotification('Logged out successfully!', 'success');

        setTimeout(()=>{
            window.location.href = 'index.html';
        },1500);
    }
    showNotification(message, type){
        const existingNotification = document.querySelector('.notification');
        if(existingNotification){
            existingNotification.remove();
        }
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;  
            display: flex;
            align-items: center;
            gap: 10px;
            animation: fadeInRight 0.5s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(()=>{
            notification.style.animation = 'fadeOutRight 0.5s ease';
            notification.addEventListener('animationend', ()=>{
                notification.remove();
            });
        }, 3000);
    }

    
}

const style = document.createElement('style');
style.textContent = `
@keyframes shake{
    0% { transform: translateX(0); }
    10%,30%,50%,70%,90% { transform: translateX(-5px); }
    20%,40%,60%,80% { transform: translateX(5px); }
}

@keyframes slideOutRight{
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
}
`;
document.head.appendChild(style);

const adminPanel = new AdminPanel();