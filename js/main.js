let courses ;
try {
    courses = JSON.parse(localStorage.getItem('courses')) || [];
} catch (error) {
    courses = [];
}

function loadCourses() {
    const container = document.getElementById('courseContainer');
    if (!container) return;

    try {
        courses = JSON.parse(localStorage.getItem('courses')) || [];
    } catch (error) {
        courses = [];
    }

    if (courses.length == 0) {
        courses = [
            {
                id: 1,
                title: 'Complete Web Development Bootcamp',
                description: 'Learn HTML, CSS, JavaScript, and more in this comprehensive course.',
                price: 99.99,
                category: 'Web Development',
                image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
                chapters: [
                    { title: 'HTML Basics', video: 'https://www.youtube.com/embed/U81030fr-EE' },
                    { title: 'CSS Fundamentals', video: 'https://www.youtube.com/embed/1Rs2ND1ryYc' },
                ]
            },
            {
                id: 2,
                title: 'Python for Data Science',
                description: 'Master Python and its libraries for data analysis and machine learning.',
                price: 89.99,
                category: 'Data Science',
                image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
                chapters: [
                    { title: 'Python Basics', video: 'https://www.youtube.com/embed/_uQrJ0TkZlc' },
                    { title: 'Pandas for Data Analysis', video: 'https://www.youtube.com/embed/vmEHCJofslg' },
                ]
            },
            {
                id: 3,
                title: 'Digital Marketing Masterclass',
                description: 'Learn SEO, social media marketing, and more to boost your online presence.',
                price: 79.99,
                category: 'Marketing',
                image: 'https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?auto=format&fit=crop&w=800&q=80',
                chapters: [
                    { title: 'SEO Basics', video: 'https://www.youtube.com/embed/1sYj3nZyQHk' },
                    { title: 'Social Media Marketing', video: 'https://www.youtube.com/embed/5QXqjvY1Z6s' },
                ]
            }
        ]
        localStorage.setItem('courses',JSON.stringify(courses));
        console.log('Save to localstorage 🎉')
    }
    displayCourses(courses);
}


function displayCourses(courseToShow){
    const container = document.getElementById('courseContainer');
    if (!container) return;

    container.innerHTML = courseToShow.map(course => `
         <div class="course-card" data-category="${course.category}">
          <div class="course-image">
          <img src="${course.image}" alt="${course.title}" loading="lazy">
          </div>
          <div class="course-info">
              <h3>${course.title}</h3>
              <p>${course.description.substring(0, 100)}...</p>
              <div class="course-meta">
              <span class="course-price">$${course.price}</span>
              <span class="course-category">${course.category}</span>
              </div>
              <a href="course-details.html?id=${course.id}" class="btn btn-details">View Course</a>
            </div>
            </div>
        `).join('');
}


function setUpFilters(){
    const filterbtns = document.querySelectorAll('.filter-btn');

    filterbtns.forEach((btn)=>{
        btn.addEventListener('click',()=>{
            const filter = btn.dataset.filter;

            const filteredCourses = filter === 'all' 
            ? courses
            : courses.filter((course) =>course.category === filter);
            displayCourses(filteredCourses);
        })
    })
}


function setUpMobileMenu(){
    const menuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if(menuBtn && navLinks){
        menuBtn.addEventListener('click',()=>{
            navLinks.classList.toggle('active');
        })
    }
}

document.addEventListener('DOMContentLoaded',()=>{
    loadCourses();
    setUpFilters();
    setUpMobileMenu();
});

