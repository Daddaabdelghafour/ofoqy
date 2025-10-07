# 🎓 OFOQY - Plateforme Intelligente d'Orientation Universitaire

<div align="center">
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" />
</div>

<div align="center">
  <h3>🌟 Révolutionner l'orientation universitaire au Maroc grâce à l'IA et l'analyse MBTI 🌟</h3>
</div>

---

## 🎯 À propos

**OFOQY** est une plateforme d'orientation universitaire innovante qui combine l'analyse de personnalité MBTI avec l'intelligence artificielle pour offrir des recommandations personnalisées d'universités et de filières aux bacheliers marocains.

### Problématique
- 35% des étudiants changent d'orientation après leur première année
- Manque d'outils d'orientation personnalisés au Maroc
- Approches traditionnelles basées uniquement sur les notes

### Solution
- Test MBTI adapté au contexte marocain
- Système de recommandation intelligent
- Chatbot spécialisé en orientation
- Base de données exhaustive des universités marocaines

---

## ✨ Fonctionnalités principales

🧠 **Test de personnalité MBTI** - Analyse psychométrique des 16 types de personnalité  
🎯 **Recommandations intelligentes** - Universités, filières et métiers personnalisés  
🤖 **Chatbot contextuel** - Assistant conversationnel expert en orientation  
📚 **Gestion des favoris** - Sauvegarde et comparaison des choix  
🔐 **Authentification sécurisée** - Système multi-garde étudiants/administrateurs  

---

## 🛠 Stack technique

**Frontend:** React + Inertia.js + Tailwind CSS  
**Backend:** Laravel + PHP 8.1 + Eloquent ORM  
**Base de données:** MySQL sur AWS RDS  
**IA:** OpenRouter API pour le chatbot et l'analyse MBTI  
**Infrastructure:** AWS EC2 + Laravel Sail + Nginx  

---

## 🚀 Installation rapide

```bash
# Cloner le projet
git clone https://github.com/votre-username/ofoqy.git
cd ofoqy

# Installation
composer install && npm install

# Configuration
cp .env.example .env
php artisan key:generate
php artisan migrate

# Démarrage
./vendor/bin/sail up
```

L'application sera accessible sur `http://localhost`

---

## ☁️ Déploiement

### Configuration AWS
- **EC2:** Instance t2.medium avec Ubuntu 22.04
- **RDS:** MySQL avec configuration multi-AZ
- **Sécurité:** VPC dédié + groupes de sécurité

### Déploiement actuel
Utilisation de **Laravel Sail** pour un déploiement rapide et fiable sur EC2, avec Nginx comme proxy inverse.

### Évolutions prévues
- Pipeline CI/CD avec GitHub Actions
- Conteneurisation Docker complète
- Infrastructure as Code avec Terraform

---

## 📊 Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React/Inertia │◄──►│  Laravel Backend │◄──►│   MySQL/RDS     │
│   (Frontend)    │    │   (API + Logic)  │    │  (Database)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                               │
                       ┌───────▼───────┐
                       │  OpenRouter   │
                       │  (IA Services)│
                       └───────────────┘
```

---

## 🤝 Équipe

**Développement:** Fadoua Chemradkhi et Abdelghafour Dadda 

**Encadrement:** M. Hamada Elkabtane (Pédagogique) | M. Ali Ait Samid (Projet)  
**Partenaire:** M. Amal Abdessamad  

---

## 📈 Impact

- **Durée:** 2 mois de développement
- **Cible:** Bacheliers marocains
- **Objectif:** Réduire les taux d'échec universitaire
- **Innovation:** Premier outil MBTI d'orientation au Maroc

---

<div align="center">
  <p><strong>Fait avec ❤️ pour l'éducation au Maroc</strong></p>
  <p>⭐ Star le projet si vous l'appréciez !</p>
</div>
