(function () {
  var script = document.currentScript;
  var host =
    (script && script.getAttribute("data-host")) ||
    "https://euromillions-resultats.fr";
  var target =
    (script && script.previousElementSibling) ||
    document.querySelector(".em-resultats-embed");
  if (!target) {
    target = document.createElement("div");
    if (script && script.parentNode) {
      script.parentNode.insertBefore(target, script);
    } else {
      document.body.appendChild(target);
    }
  }
  fetch(host.replace(/\/$/, "") + "/api/embed/resultats")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (data && data.html) target.innerHTML = data.html;
    })
    .catch(function () {
      target.innerHTML =
        '<p style="font:14px/1.4 system-ui,sans-serif"><a href="' +
        host +
        '/fr">Résultats EuroMillions</a></p>';
    });
})();
