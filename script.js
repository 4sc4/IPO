const downloadCount = document.getElementById("downloadCount");

async function afficherTelechargements() {
    try {
        const response = await fetch(
            "https://api.github.com/repos/4sc4/IPO/releases/latest"
        );

        if (!response.ok) {
            throw new Error("Aucune release trouvée");
        }

        const release = await response.json();

        const apk = release.assets.find(
            asset => asset.name.toLowerCase() === "ipo.apk"
        );

        if (apk) {
            downloadCount.textContent =
                apk.download_count.toLocaleString("fr-FR");
        }
    } catch (error) {
        console.log("Compteur :", error.message);
    }
}

afficherTelechargements();
