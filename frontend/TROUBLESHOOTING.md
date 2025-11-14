# 🔧 Troubleshooting - Tailwind CSS Error

Si vous rencontrez l'erreur PostCSS avec Tailwind CSS :
```
It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
```

## ✅ Solution Recommandée (Toutes Plateformes)

```bash
# 1. Arrêter le serveur Vite (Ctrl+C)

# 2. Récupérer les dernières modifications
git pull

# 3. Aller dans le dossier frontend
cd frontend

# 4. Nettoyer et réinstaller (utilisez LA COMMANDE APPROPRIÉE)

# Sur Windows (PowerShell/CMD):
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install

# Sur Linux/Mac:
npm cache clean --force
rm -rf node_modules package-lock.json .vite
npm install

# 5. Redémarrer le serveur
npm run dev
```

## 🚀 Solution Rapide (Script npm)

Nous avons ajouté des scripts pour faciliter le nettoyage :

```bash
# Windows (CMD/PowerShell)
npm run clean:win
npm install
npm run dev

# Linux/Mac
npm run clean
npm install
npm run dev
```

## ✔️ Vérification

Après l'installation, vérifiez que vous avez les bonnes versions :

```bash
npm list tailwindcss
# ✅ Devrait afficher: tailwindcss@3.4.18

npm list postcss
# ✅ Devrait afficher: postcss@8.5.6

npm list autoprefixer
# ✅ Devrait afficher: autoprefixer@10.4.22
```

## ❌ Si le Problème Persiste

1. **Supprimer le cache Vite:**
   ```bash
   # Windows
   rmdir /s /q .vite

   # Linux/Mac
   rm -rf .vite
   ```

2. **Forcer la réinstallation de Tailwind:**
   ```bash
   npm uninstall tailwindcss
   npm install -D tailwindcss@3.4.18
   ```

3. **Vérifier que PostCSS est bien configuré:**
   - Le fichier `postcss.config.js` doit contenir:
     ```js
     export default {
       plugins: {
         tailwindcss: {},
         autoprefixer: {},
       },
     }
     ```

## 📝 Notes

- Les versions sont maintenant verrouillées (sans `^`) pour éviter les mises à jour automatiques vers Tailwind v4
- `package.json` spécifie: `tailwindcss: "3.4.18"` (version exacte)
- Si vous voyez une version 4.x.x, c'est que node_modules n'a pas été nettoyé correctement
