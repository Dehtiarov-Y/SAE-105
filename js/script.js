// Смотрим на какой мы странице 
var bodyId = document.body.id;

if (bodyId == "page-projects") {
    // Si on est sur la page de la grille, on charge la grille
    chargerGrilleProjets();
    
    // Запуск интро-видео
    gererVideoIntro();

} else if (bodyId == "page-sae-detail") {
    // Si on est sur la page de détail, on charge les détails
    chargerDetailSAE();
}

/**
 * Fonction pour gérer la vidéo d'intro (Preloader)
 */
function gererVideoIntro() {
    var loader = document.getElementById("video-loader");
    var video = document.getElementById("intro-video");

    // Проверяем, есть ли элементы на странице (чтобы не было ошибок на других страницах)
    if (loader && video) {
        
        // Функция для скрытия видео
        var cacherLoader = function() {
            loader.classList.add("loader-hidden");
            // Небольшая задержка перед паузой, чтобы анимация css успела начаться
            setTimeout(function() {
                video.pause();
                document.documentElement.style.overflowY = 'auto';
            }, 500); 
        };

        // Когда видео заканчивается (событие 'ended')
        video.onended = function() {
            cacherLoader();
        };

        // ПРЕДОХРАНИТЕЛЬ: Если видео не прогрузилось или застряло, 
        // убираем заставку принудительно через 6 секунд.
        setTimeout(function() {
            cacherLoader();
        }, 6000); 
    }
}

/**
 * Fonction pour charger la grille des projets sur projects.html
 * (Cette fonction est entièrement réécrite pour trier par semestre)
 */
function chargerGrilleProjets() {
    // ИЗМЕНЕНИЕ: Мы целимся в новый контейнер
    var mainContainer = document.querySelector("#semestres-container");
    if (!mainContainer) return; // Sécurité

    // 1. Создаем "карманы" для HTML-кода каждого семестра
    var htmlSemestre1 = "";
    var htmlSemestre2 = "";
    // (Ты можешь легко добавить htmlSemestre3, htmlSemestre4 и т.д. в будущем)

    var clesSAE = Object.keys(SAE); 

    // Сортируем все SAE по семестрам
    for (var i = 0; i < clesSAE.length; i++) {
        var cle = clesSAE[i];
        var sae = SAE[cle];

        var imgSrc = sae.image_preview || 'https://via.placeholder.com/300x180.png?text=Image+non+disponible';
        var competencesTexte = sae.compétences.join(', '); // Эта строка объединяет все competences в один, как например в sae 202(кнопка), там где несколько объектов 

        // Делаем карточку html, то есть все для неё, фото, текст кнопки, титр
        var carteHtml = 
            '<div class="sae-card">' +
                '<div class="preview-image">' +
                    '<img src="' + imgSrc + '" alt="Aperçu ' + sae.titre + '">' +
                '</div>' +
                '<h2>' + cle + '</h2>' +
                '<p>' + sae.titre + '</p>' +
                '<a href="sae.html?num=' + cle + '" class="btn">' + competencesTexte + '</a>' +
            '</div>';
        
        // Помещаем HTML карточки в правильный "карман"
        if (sae.semestre == 1) {
            htmlSemestre1 += carteHtml;
        } else if (sae.semestre == 2) {
            htmlSemestre2 += carteHtml;
        }
        // место чтобы добавить потом, если появится семестра 3. 
    }

    // 3. Собираем финальный HTML для всей страницы
    var finalHtml = "";

    // Добавляем секцию Семестра 1, только если в ней есть проекты
    if (htmlSemestre1.length > 0) {
        finalHtml += '<h2 class="semestre-titre">Semestre 1</h2>'; 
        finalHtml += '<section class="sae-grid">' + htmlSemestre1 + '</section>';
    }

    // Добавляем секцию Семестра 2, только если в ней есть проекты
    if (htmlSemestre2.length > 0) {
        finalHtml += '<h2 class="semestre-titre">Semestre 2</h2>'; 
        finalHtml += '<section class="sae-grid">' + htmlSemestre2 + '</section>'; 
    }

    // 4. Вставляем все на страницу ОДНИМ действием
    mainContainer.innerHTML = finalHtml;
}


/**
 * Fonction pour charger les détails sur sae.html
 * (Cette fonction inclut la gestion du bouton PDF)
 */
function chargerDetailSAE() {
    var param = new URLSearchParams(location.search);
    var presentation = param.get("num"); // Эта строка собирает sae101, sae 102 и тд

    if (!presentation || !SAE[presentation]) {
        document.querySelector("main").innerHTML = "<p class='erreur'>Cette SAÉ n'existe pas.</p>";
        var header = document.querySelector("#sae-header");
        if (header) header.style.display = 'none';
        return;
    }

    var sae = SAE[presentation]; 

    var AC_Liste = "";
    var ac_SAE = sae.AC;
    var cle_ac_liste = Object.keys(ac_SAE); 
    
    for (var i = 0; i < cle_ac_liste.length; i++) {
        var cle_ac = cle_ac_liste[i];
        AC_Liste += "<p class='SAE_sous_Categorie'><strong>" + cle_ac + " :</strong> " + ac_SAE[cle_ac] + "</p>";
    }

    var ressource_liste = "";
    var ressources_SAE = sae.ressources;
    var cle_res_liste = Object.keys(ressources_SAE); 
    
    for (var i = 0; i < cle_res_liste.length; i++) {
        var cle_res = cle_res_liste[i];
        ressource_liste += "<p class='SAE_sous_Categorie'><strong>" + cle_res + " :</strong> " + ressources_SAE[cle_res] + "</p>";
    }

    var competencesHtml = sae.compétences.join(', ');

    var presentation_SAE = 
        "<h3>Semestre : <span class='SAE_Categorie'>" + sae.semestre + "</span></h3>" +
        "<h3>Compétences :</h3><div class='SAE_Categorie'>" + competencesHtml + "</div>" +
        "<h3>Description :</h3><div class='SAE_Categorie'>" + sae.description + "</div>" +
        "<h3>Apprentissage Critique :</h3><div>" + AC_Liste + "</div>" +
        "<h3>Ressources :</h3><div>" + ressource_liste + "</div>";

    document.querySelector("#sae-header").innerHTML = "<h1>" + presentation + " : " + sae.titre + "</h1>";
    document.querySelector("#sae-content").innerHTML = presentation_SAE;

    /* === ОБНОВЛЯЕМ КНОПКУ PDF === */
    
    // Находим кнопку пдф в футере
    var btnPdf = document.querySelector("footer .btn"); 
    
    // Проверяем есть ли у проекта файл пдф в data.js
    if (sae.link_pdf) {
        btnPdf.href = sae.link_pdf; 
        btnPdf.style.display = "inline-block";
        btnPdf.target = "_blank"; 
        btnPdf.innerText = "Le fichier PDF"; 
    } else {
        btnPdf.style.display = "none";
    }
}  