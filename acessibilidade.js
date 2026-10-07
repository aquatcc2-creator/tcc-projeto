/* =====================================================
   ACESSIBILIDADE - AQUA TRACK
===================================================== */


/* ELEMENTOS */

const btnAcessibilidade =
    document.getElementById("btnAcessibilidade");

const painelAcessibilidade =
    document.getElementById("painelAcessibilidade");

const fecharAcessibilidade =
    document.getElementById("fecharAcessibilidade");


/* =====================================================
   ABRIR E FECHAR PAINEL
===================================================== */

btnAcessibilidade.addEventListener("click", function () {

    painelAcessibilidade.classList.toggle("aberto");

});


fecharAcessibilidade.addEventListener("click", function () {

    painelAcessibilidade.classList.remove("aberto");

});


/* =====================================================
   LEITURA POR VOZ
===================================================== */

let leituraAtual = null;


/* LER */

document.getElementById("lerPagina")
    .addEventListener("click", function () {

        window.speechSynthesis.cancel();

        let texto = document.body.innerText;

        /* Remove textos do painel de acessibilidade */

        texto = texto.replace(
            /Acessibilidade[\s\S]*?Restaurar padrão/,
            ""
        );

        leituraAtual =
            new SpeechSynthesisUtterance(texto);

        leituraAtual.lang = "pt-BR";

        leituraAtual.rate = 0.9;

        leituraAtual.pitch = 1;

        window.speechSynthesis.speak(leituraAtual);

    });


/* PAUSAR */

document.getElementById("pausarLeitura")
    .addEventListener("click", function () {

        if (window.speechSynthesis.speaking) {

            window.speechSynthesis.pause();

        }

    });


/* PARAR */

document.getElementById("pararLeitura")
    .addEventListener("click", function () {

        window.speechSynthesis.cancel();

    });

/* =====================================================
   TAMANHO DO TEXTO
===================================================== */

let tamanhoTexto = 0;


/* AUMENTAR */

document.getElementById("aumentarTexto")
    .addEventListener("click", function () {

        if (tamanhoTexto < 3) {

            tamanhoTexto++;

            document.body.classList.remove(
                "texto-grande-1",
                "texto-grande-2",
                "texto-grande-3"
            );

            document.body.classList.add(
                "texto-grande-" + tamanhoTexto
            );

        }

    });


/* DIMINUIR */

document.getElementById("diminuirTexto")
    .addEventListener("click", function () {

        if (tamanhoTexto > -2) {

            tamanhoTexto--;

            document.body.classList.remove(
                "texto-pequeno-1",
                "texto-pequeno-2",
                "texto-grande-1",
                "texto-grande-2",
                "texto-grande-3"
            );

            if (tamanhoTexto < 0) {

                document.body.classList.add(
                    "texto-pequeno-" + Math.abs(tamanhoTexto)
                );

            } else if (tamanhoTexto > 0) {

                document.body.classList.add(
                    "texto-grande-" + tamanhoTexto
                );

            }

        }

    });


/* NORMAL */

document.getElementById("textoNormal")
    .addEventListener("click", function () {

        tamanhoTexto = 0;

        document.body.classList.remove(
            "texto-pequeno-1",
            "texto-pequeno-2",
            "texto-grande-1",
            "texto-grande-2",
            "texto-grande-3"
        );

    });


/* =====================================================
   TEMA CLARO
===================================================== */

document.getElementById("temaClaro")
    .addEventListener("click", function () {

        document.body.classList.add("tema-claro");

    });


/* =====================================================
   TEMA ESCURO
===================================================== */

document.getElementById("temaEscuro")
    .addEventListener("click", function () {

        document.body.classList.remove("tema-claro");

    });


/* =====================================================
   RESTAURAR TUDO
===================================================== */

document.getElementById("restaurarAcessibilidade")
    .addEventListener("click", function () {

        /* Restaurar tema */

        document.body.classList.remove("tema-claro");


        /* Restaurar tamanho */

        tamanhoTexto = 100;

        document.documentElement.style.fontSize = "100%";


        /* Parar leitura */

        window.speechSynthesis.cancel();


        /* Fechar painel */

        painelAcessibilidade.classList.remove("aberto");

    });