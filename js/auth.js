// Controle de autenticação e proteção de páginas
function verificarAutenticacao(redirecionarSeDeslogado = true, callbackUsuario = null) {
    if (!auth) return;

    auth.onAuthStateChanged(user => {
        if (!user && redirecionarSeDeslogado) {
            window.location.href = "login.html";
        } else if (user) {
            const nome = user.displayName || user.email.split('@')[0];
            const elementosNome = document.querySelectorAll(".usuario-nome, #topoNomeUsuario, #saudacaoNomeUsuario");
            elementosNome.forEach(el => {
                if (el.id === "saudacaoNomeUsuario") {
                    el.textContent = `Olá, ${nome}!`;
                } else {
                    el.textContent = `Olá, ${nome}!`;
                }
            });

            if (typeof callbackUsuario === "function") {
                callbackUsuario(user);
            }
        }
    });
}

function fazerLogout() {
    if (!auth) return;
    auth.signOut().then(() => {
        window.location.href = "login.html";
    });
}

// Configura botões de logout automáticos
document.addEventListener("DOMContentLoaded", () => {
    const btnSair = document.getElementById("btnSair");
    if (btnSair) {
        btnSair.addEventListener("click", (e) => {
            e.preventDefault();
            fazerLogout();
        });
    }
});

