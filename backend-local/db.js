const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'TON_MOT_DE_PASSE',  // ← Remplace par ton mot de passe MySQL
    database: 'edutrack_local',
    waitForConnections: true,
    connectionLimit: 10
});

async function initDB() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connecté à MySQL local');
        connection.release();
        
        // Création automatique des tables si elles n'existent pas
        await pool.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id INT PRIMARY KEY AUTO_INCREMENT,
                titre VARCHAR(255) NOT NULL,
                description TEXT,
                formateur VARCHAR(255),
                niveau VARCHAR(50),
                categorie VARCHAR(100),
                statut VARCHAR(50) DEFAULT 'actif',
                duree VARCHAR(50),
                inscrits INT DEFAULT 0,
                progression INT DEFAULT 0,
                modules INT DEFAULT 1
            )
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nom VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE,
                groupe VARCHAR(50),
                statut VARCHAR(50) DEFAULT 'actif',
                avatar TEXT
            )
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS enrollments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                student_id INT,
                course_id INT,
                progression INT DEFAULT 0,
                score INT DEFAULT 0,
                statut VARCHAR(50) DEFAULT 'en_cours',
                certificat BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
                UNIQUE(student_id, course_id)
            )
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS quizzes (
                id INT PRIMARY KEY AUTO_INCREMENT,
                titre VARCHAR(255) NOT NULL,
                course_id INT,
                questions JSON NOT NULL,
                duree INT DEFAULT 5,
                score_min INT DEFAULT 50,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
            )
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS quiz_results (
                id INT PRIMARY KEY AUTO_INCREMENT,
                quiz_id INT,
                student_id INT,
                score INT NOT NULL,
                reponses JSON,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            )
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS announcements (
                id INT PRIMARY KEY AUTO_INCREMENT,
                titre VARCHAR(255) NOT NULL,
                contenu TEXT,
                priorite VARCHAR(50) DEFAULT 'normal',
                auteur VARCHAR(255),
                course_id INT,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
            )
        `);
        
        // Insertion des données de démo si tables vides
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM courses');
        if (rows[0].count === 0) {
            await pool.query(`
                INSERT INTO courses (titre, description, formateur, niveau, duree, progression) VALUES
                ('HTML & CSS', 'Maîtrisez les bases du web', 'Maxime', 'Débutant', '20h', 75),
                ('JavaScript', 'Devenez expert en JS', 'Sophie', 'Intermédiaire', '35h', 45),
                ('React', 'Créez des apps modernes', 'Alex', 'Avancé', '40h', 20),
                ('Python', 'Programmation polyvalente', 'Julie', 'Débutant', '25h', 60)
            `);
        }
        
        const [studentsCount] = await pool.query('SELECT COUNT(*) as count FROM students');
        if (studentsCount[0].count === 0) {
            await pool.query(`
                INSERT INTO students (nom, email, groupe) VALUES
                ('Alice Martin', 'alice@email.com', 'G1'),
                ('Bob Durand', 'bob@email.com', 'G1'),
                ('Claire Petit', 'claire@email.com', 'G2')
            `);
        }
        
        console.log('✅ Tables MySQL vérifiées/créées');
        
    } catch (err) {
        console.error('❌ Erreur MySQL:', err);
    }
}

module.exports = { pool, initDB };
