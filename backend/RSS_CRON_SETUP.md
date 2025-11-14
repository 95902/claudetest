# 📡 RSS Feeds - Automatic Cron Setup

Ce guide explique comment configurer le fetch automatique des flux RSS une fois par jour.

## 🚀 Commande Ace

La commande suivante fetch tous les flux RSS actifs:

```bash
node ace fetch:rss-feeds
```

Cette commande:
- ✅ Récupère tous les flux RSS actifs
- ✅ Parse chaque flux et extrait les articles
- ✅ Évite les doublons (vérifie link et guid)
- ✅ Extrait les images des articles
- ✅ Met à jour les statistiques de chaque flux
- ✅ Affiche un résumé détaillé

## ⏰ Configuration du Cron (Linux/Mac)

### Option 1: Crontab système

Éditez votre crontab:
```bash
crontab -e
```

Ajoutez cette ligne pour exécuter tous les jours à 6h du matin:
```bash
0 6 * * * cd /path/to/your/project/backend && node ace fetch:rss-feeds >> /var/log/rss-cron.log 2>&1
```

### Option 2: Cron avec PM2

Si vous utilisez PM2 pour gérer votre application:

```bash
# Installer pm2-cron
npm install pm2 -g

# Créer un fichier ecosystem.config.js
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'rss-cron',
    script: 'ace',
    args: 'fetch:rss-feeds',
    cron_restart: '0 6 * * *',  // Tous les jours à 6h
    autorestart: false,
    watch: false
  }]
}
```

Lancer avec PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
```

## 🪟 Configuration Windows (Task Scheduler)

### Via PowerShell

Créez un script PowerShell `fetch-rss.ps1`:

```powershell
# fetch-rss.ps1
cd C:\path\to\your\project\backend
node ace fetch:rss-feeds
```

Puis créez une tâche planifiée:

```powershell
$action = New-ScheduledTaskAction -Execute 'PowerShell.exe' -Argument '-File "C:\path\to\fetch-rss.ps1"'
$trigger = New-ScheduledTaskTrigger -Daily -At 6am
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName "RSS Feed Fetch" -Action $action -Trigger $trigger -Principal $principal
```

### Via Task Scheduler GUI

1. Ouvrez Task Scheduler (`taskschd.msc`)
2. Create Basic Task → "RSS Feed Fetch"
3. Trigger: Daily à 6:00 AM
4. Action: Start a program
   - Program: `node`
   - Arguments: `ace fetch:rss-feeds`
   - Start in: `C:\path\to\your\project\backend`

## 🐳 Configuration Docker

Si vous utilisez Docker, ajoutez un service cron dans `docker-compose.yml`:

```yaml
services:
  rss-cron:
    build: ./backend
    command: sh -c "while true; do node ace fetch:rss-feeds && sleep 86400; done"
    depends_on:
      - postgres
    environment:
      - NODE_ENV=production
```

Ou utilisez un conteneur cron dédié:

```yaml
services:
  cron:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./backend:/app
    command: sh -c "echo '0 6 * * * cd /app && node ace fetch:rss-feeds' | crontab - && crond -f"
    depends_on:
      - postgres
```

## 🧪 Test manuel

Pour tester immédiatement:

```bash
cd backend
node ace fetch:rss-feeds
```

Vous verrez un résumé comme:
```
🚀 Starting RSS feeds fetch...
📡 Found 13 active feeds

📰 Fetching: OpenAI Blog
   ✅ 5 new articles

📰 Fetching: Anthropic News
   ✅ 3 new articles

...

==================================================
📊 SUMMARY
==================================================
✅ Success: 13 feeds
📰 Total new articles: 47
⏱️  Duration: 12.34s
==================================================
```

## 📝 Logs

Pour logger les résultats dans un fichier:

```bash
# Linux/Mac
node ace fetch:rss-feeds >> logs/rss-cron.log 2>&1

# Windows PowerShell
node ace fetch:rss-feeds | Out-File -Append logs\rss-cron.log
```

## 🔧 Configuration personnalisée

Vous pouvez modifier la fréquence dans le cron:

```bash
# Toutes les 6 heures
0 */6 * * * cd /path && node ace fetch:rss-feeds

# Toutes les heures
0 * * * * cd /path && node ace fetch:rss-feeds

# Tous les lundis à 9h
0 9 * * 1 cd /path && node ace fetch:rss-feeds
```

## 🎯 Bonnes pratiques

1. **Logs**: Toujours logger les résultats pour déboguer
2. **Notifications**: Configurez des alertes en cas d'échec
3. **Timeout**: Ajoutez un timeout pour éviter que le processus ne bloque
4. **Monitoring**: Utilisez un outil comme Sentry ou New Relic pour surveiller les erreurs

## 📚 Flux RSS configurés

Le système fetch automatiquement:

**Tech Companies (9)**:
- OpenAI Blog
- Anthropic News
- Google AI Blog
- DeepMind
- Microsoft AI
- Meta AI
- Mistral AI
- Cohere
- Stability AI

**French Media (4)**:
- Actu IA
- 01net
- Blog du Modérateur
- Clubic

Total: **13 flux RSS actifs** 📡
