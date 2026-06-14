// ============================================
// EDUTRACK - VERSION LOCALE (MySQL)
// URL: http://localhost:3000/api
// ============================================

const API_URL = 'http://localhost:3000/api';

// ========== FONCTIONS API ==========

async function getCourses() {
    const response = await fetch(`${API_URL}/courses`);
    return await response.json();
}

async function ajouterCours(cours) {
    const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cours)
    });
    return await response.json();
}

async function supprimerCours(id) {
    await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE' });
}

async function getStudents() {
    const response = await fetch(`${API_URL}/students`);
    return await response.json();
}

async function ajouterEtudiant(etudiant) {
    const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(etudiant)
    });
    return await response.json();
}

async function supprimerEtudiant(id) {
    await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
}

async function getEnrollments() {
    const response = await fetch(`${API_URL}/enrollments`);
    return await response.json();
}

async function inscrireApprenant(student_id, course_id) {
    const response = await fetch(`${API_URL}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id, course_id })
    });
    return await response.json();
}

async function getQuizzes() {
    const response = await fetch(`${API_URL}/quizzes`);
    return await response.json();
}

async function enregistrerResultatQuiz(quiz_id, student_id, score, reponses) {
    const response = await fetch(`${API_URL}/quiz-results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quiz_id, student_id, score, reponses })
    });
    return await response.json();
}

async function getAnnouncements() {
    const response = await fetch(`${API_URL}/announcements`);
    return await response.json();
}

async function ajouterAnnonce(annonce) {
    const response = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(annonce)
    });
    return await response.json();
}

// Export pour le HTML
window.getCourses = getCourses;
window.ajouterCours = ajouterCours;
window.supprimerCours = supprimerCours;
window.getStudents = getStudents;
window.ajouterEtudiant = ajouterEtudiant;
window.supprimerEtudiant = supprimerEtudiant;
window.getEnrollments = getEnrollments;
window.inscrireApprenant = inscrireApprenant;
window.getQuizzes = getQuizzes;
window.enregistrerResultatQuiz = enregistrerResultatQuiz;
window.getAnnouncements = getAnnouncements;
window.ajouterAnnonce = ajouterAnnonce;

console.log('✅ EduTrack version locale (MySQL) chargée - API sur http://localhost:3000');
