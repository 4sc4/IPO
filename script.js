const downloadCount = document.getElementById("downloadCount");

async function afficherTelechargements() {
    try {
        const response = await fetch(
            "https://api.github.com/repos/4sc4/IPO/releases"
        );

        if (!response.ok) {
            throw new Error("Impossible de récupérer les Releases");
        }

        const releases = await response.json();

        let total = 0;

        releases.forEach(release => {
            release.assets.forEach(asset => {
                if (asset.name.toLowerCase() === "ipo.apk") {
                    total += asset.download_count;
                }
            });
        });

        downloadCount.textContent = total.toLocaleString("fr-FR");

    } catch (error) {
        console.log("Compteur :", error.message);
    }
}

afficherTelechargements();
