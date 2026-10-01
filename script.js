// Récupère l'élément de la page qui affiche le nombre de téléchargements
const downloadCount = document.getElementById("downloadCount");

// Récupère le bouton "Web ( IOS/Android )" pour compter ses clics
const lienWeb = document.getElementById("lienWeb");

// Adresse du compteur en ligne qui retient les clics sur le bouton web (service gratuit counterapi.dev)
const URL_COMPTEUR_WEB = "https://api.counterapi.dev/v1/ipo-4sc4-github/web";

// Nombre de téléchargements de l'APK (donné par GitHub)
let totalApk = 0;

// Nombre de clics sur le bouton web (donné par le compteur en ligne)
let totalWeb = 0;

// Affiche la somme APK + web dans la page
function afficherTotal() {
    // Écrit le total avec la mise en forme française (ex: 1 413)
    downloadCount.textContent = (totalApk + totalWeb).toLocaleString("fr-FR");
}

// Lit le nombre de téléchargements de l'APK sur GitHub
async function lireApk() {
    // Essaie la requête, et gère l'erreur si elle échoue
    try {
        // Demande la liste des releases du dépôt à GitHub
        const response = await fetch("https://api.github.com/repos/4sc4/IPO/releases");

        // Si GitHub répond avec une erreur, on arrête ici
        if (!response.ok) {
            // Déclenche une erreur gérée plus bas
            throw new Error("Impossible de récupérer les Releases");
        }

        // Transforme la réponse en données utilisables
        const releases = await response.json();

        // Parcourt chaque release
        releases.forEach(release => {
            // Parcourt chaque fichier de la release
            release.assets.forEach(asset => {
                // Ne garde que le fichier ipo.apk
                if (asset.name.toLowerCase() === "ipo.apk") {
                    // Ajoute son nombre de téléchargements au total APK
                    totalApk += asset.download_count;
                }
            });
        });
    } catch (error) {
        // En cas de problème, affiche l'erreur dans la console
        console.log("Compteur APK :", error.message);
    }
}

// Lit le nombre de clics déjà enregistrés sur le bouton web
async function lireWeb() {
    // Essaie la requête, et gère l'erreur si elle échoue
    try {
        // Demande la valeur actuelle du compteur web
        const response = await fetch(URL_COMPTEUR_WEB);

        // Si le compteur répond correctement
        if (response.ok) {
            // Transforme la réponse en données utilisables
            const data = await response.json();

            // Garde le nombre de clics (0 si absent)
            totalWeb = data.count || 0;
        }
    } catch (error) {
        // En cas de problème, affiche l'erreur dans la console
        console.log("Compteur web :", error.message);
    }
}

// Quand on clique sur le bouton web, on ajoute 1 au compteur web
lienWeb.addEventListener("click", () => {
    // Envoie "+1" au compteur; keepalive laisse la requête finir même si la page change
    fetch(URL_COMPTEUR_WEB + "/up", { keepalive: true }).catch(() => {});
});

// Charge les deux compteurs en même temps, puis affiche le total
async function init() {
    // Attend que l'APK et le web soient lus
    await Promise.all([lireApk(), lireWeb()]);

    // Affiche la somme dans la page
    afficherTotal();
}

// Lance tout au chargement de la page
init();
