const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS champions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    role TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    is_public INTEGER DEFAULT 1,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;

if (userCount === 0) {
  const hashedPassword = bcrypt.hashSync('password123', 10);
  const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  const result = insertUser.run('AhriMain', hashedPassword);
  const defaultUserId = Number(result.lastInsertRowid);

  const insertChamp = db.prepare(`
    INSERT INTO champions (name, title, role, difficulty, image_url, description, is_public, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const starterChampions = [
    {
      name: 'Ahri',
      title: 'The Nine-Tailed Fox',
      role: 'Mage',
      difficulty: 'Moderate',
      image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg',
      description: 'Innately connected to the latent power of Runeterra, Ahri is a vastaya who can reshape magic into orbs of raw energy.'
    },
    {
      name: 'Lux',
      title: 'The Lady of Luminosity',
      role: 'Mage',
      difficulty: 'Low',
      image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_0.jpg',
      description: 'Luxanna Crownguard hails from Demacia, an insular realm where magical abilities are viewed with fear and suspicion.'
    },
    {
      name: 'Yasuo',
      title: 'The Unforgiven',
      role: 'Fighter',
      difficulty: 'High',
      image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg',
      description: 'An Ionian of deep resolve, Yasuo is an agile swordsman who wields the air itself against his enemies.'
    },
    {
      name: 'Darius',
      title: 'The Hand of Noxus',
      role: 'Fighter',
      difficulty: 'Low',
      image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Darius_0.jpg',
      description: 'There is no greater symbol of Noxian might than Darius, the nation’s most feared and battle-hardened commander.'
    },
    {
      name: 'Jinx',
      title: 'The Loose Cannon',
      role: 'Marksman',
      difficulty: 'Moderate',
      image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg',
      description: 'A manic and impulsive criminal from Zaun, Jinx lives to wreak havoc without care for the consequences.'
    },
    {
      name: 'Caitlyn',
      title: 'The Sheriff of Piltover',
      role: 'Marksman',
      difficulty: 'Low',
      image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Caitlyn_0.jpg',
      description: 'Renowned as its finest peacekeeper, Caitlyn is also Piltover’s best shot at ridding the city of its elusive criminal elements.'
    },
    {
      name: 'Zed',
      title: 'The Master of Shadows',
      role: 'Assassin',
      difficulty: 'High',
      image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_0.jpg',
      description: 'Utterly ruthless and without mercy, Zed is the leader of the Order of Shadow, an organization he created to militarize Ionia’s magical and martial traditions.'
    },
    {
      name: 'Akali',
      title: 'The Rogue Assassin',
      role: 'Assassin',
      difficulty: 'High',
      image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Akali_0.jpg',
      description: 'Abandoning the Kinkou Order and her title of the Fist of Shadow, Akali now strikes alone, ready to be the deadly weapon her people need.'
    },
    {
      name: 'Thresh',
      title: 'The Chain Warden',
      role: 'Support',
      difficulty: 'High',
      image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_0.jpg',
      description: 'Sadistic and cunning, Thresh is an ambitious and restless spirit of the Shadow Isles who delights in tormenting mortals.'
    },
    {
      name: 'Braum',
      title: 'The Heart of the Freljord',
      role: 'Support',
      difficulty: 'Low',
      image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Braum_0.jpg',
      description: 'Blessed with massive biceps and an even bigger heart, Braum is a beloved hero of the Freljord.'
    },
    {
      name: 'Leona',
      title: 'The Radiant Dawn',
      role: 'Tank',
      difficulty: 'Low',
      image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Leona_0.jpg',
      description: 'Imbued with the fire of the sun, Leona is a holy warrior of the Solari who defends Mount Targon with her Zenith Blade and Shield of Daybreak.'
    },
    {
      name: 'Ornn',
      title: 'The Fire Below the Mountain',
      role: 'Tank',
      difficulty: 'Moderate',
      image_url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ornn_0.jpg',
      description: 'Ornn is the Freljordian spirit of forging and craftsmanship, working in the solitude of a massive smithy beneath the Hearth-Home volcano.'
    }
  ];

  for (const champ of starterChampions) {
    insertChamp.run(
      champ.name,
      champ.title,
      champ.role,
      champ.difficulty,
      champ.image_url,
      champ.description,
      1,
      defaultUserId
    );
  }
}

module.exports = db;
