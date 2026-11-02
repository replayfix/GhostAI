# GhostAI · DJ Studio — prototipo 03

Abre `index.html` en Edge o Chrome. Si ya lo tenías abierto, recarga con Ctrl + F5. No requiere instalar paquetes. El análisis de música y los pedidos escritos son locales.

## DJ automático con lista

1. En «Una lista. Un set continuo», agrega o arrastra tres o más archivos. Espera a que aparezcan como «Lista». Se estima tempo, energía y comienzo/final del audio útil; no son etiquetas de género ni detección de frases.
2. Elige «Prueba rápida · 20 s por canción» para escuchar varias transiciones pronto, o «Canciones completas» para un set normal. Selecciona esto antes de iniciar.
3. Activa efectos automáticos y, opcionalmente, base durante las transiciones. Pulsa «Iniciar DJ automático». Esto inicia un set nuevo desde la primera canción pendiente; no continúa la posición anterior.
4. El motor prepara la siguiente canción, prioriza compatibilidad de tempo y energía, y alterna A → B → A hasta agotar la lista. Las canciones reproducidas se marcan como tales. Los pedidos del asistente pueden cambiar ese orden.
5. Si puede ajustar el tempo dentro de ±8%, hace una transición con alineación aproximada. Si no puede, usa un fundido de cinco segundos sin forzar sincronización. Evita silencios largos al principio/final. No reconoce compases reales.
6. Los efectos se eligen por diferencia de energía: barrido o eco e intercambio de graves. La base es percusión sintetizada, no música generada con IA.
7. «Pausar automatización» devuelve los controles manuales y deja la reproducción actual. «Detener todo» apaga el audio. Las acciones manuales detienen el DJ automático. Mantén la pestaña activa para esta prueba; no se garantiza continuidad si el navegador la suspende.

## Asistente escrito y por voz

- Asigna un género a cada canción usando el selector de la cola. El motor no reconoce géneros por sí mismo.
- Escribe «siguiente [nombre de archivo o parte del título]» para programar una canción local. Las coincidencias ambiguas requieren un nombre más completo. Durante una transición el pedido se atiende después de terminarla.
- Escribe «cambia a salsa» para dar prioridad a las canciones pendientes con ese género. Cuando se agotan, vuelve a los demás géneros.
- «Inicia» comienza un set; «pausa» detiene únicamente la automatización.
- «Busca [nombre] en Spotify», «en Deezer», «en Apple Music» o «en YouTube» muestra un enlace de búsqueda. Debes abrirlo para consultar resultados. No hay conexión de cuentas, consulta de catálogos en segundo plano, importación ni reproducción desde esos servicios. Si no encuentra un título local, ofrece búsquedas en las cuatro plataformas.
- Para voz, pulsa «Activar voz» y concede permiso en el navegador. Di «GhostAI, siguiente [título]» o «GhostAI, cambia a salsa». Solo se procesan frases que empiecen con «GhostAI». El volumen baja mientras escucha y vuelve al apagarlo. Se muestra el pedido reconocido; el asistente no habla para evitar realimentación.
- El reconocimiento depende del navegador y puede enviar audio al proveedor y necesitar Internet. No es un reconocedor de voz local instalado. Puede no funcionar al abrir un archivo local, por permisos, red o falta de soporte; los pedidos escritos siguen disponibles. Usa auriculares para reducir la captación de la propia música. Si el servicio termina la sesión, vuelve a activar voz.

## Uso manual de dos decks

1. Arrastra un MP3 o WAV sobre cada plato, o selecciónalo con el botón de archivo. Espera el análisis.
2. Comprueba los BPM; corrígelos si conoces su valor. El algoritmo usa periodicidad de ataques en los primeros 90 segundos: puede confundir el doble o la mitad del tempo.
3. Usa Reproducir en A. Puedes mover el crossfader manualmente.
4. Elige la duración de Automix en golpes. Activa efectos y, si quieres, base de percusión.
5. Pulsa AUTOMIX A → B. Ajustará la velocidad de B, buscará un ataque inicial y aproximará su entrada al pulso de A. Pasará de A a B con intercambio de graves, barrido de ruido y eco si activaste efectos. B entra desde el ataque detectado en sus primeros ocho segundos. No se reconocen compases ni frases musicales; un ataque fuerte puede estar fuera del primer golpe.
6. Prueba los pads KICK, CLAP, HI-HAT y SWEEP. ECHO actúa en los decks que estén reproduciendo. BASE activa una percusión sintética continua. Ajusta su volumen con Nivel de base.
7. Cada deck tiene controles de graves y agudos. Detener todo cancela la mezcla, los sonidos sintetizados y la base.

Esta versión reproduce audio real, anima los platos, dibuja formas de onda y estima BPM en un worker. Automix es un motor de reglas, no un modelo de IA. La alineación es aproximada y depende de la estimación de tempo. No incluye separación de voces/instrumentos, conservación de tono al cambiar velocidad, análisis de tonalidad, exportación ni conexiones de Spotify, Deezer o Apple Music. No garantiza transiciones profesionales: falta reconocer frases, tonalidad y puntos de mezcla. Las canciones no se conservan al recargar. La base sintetizada no se adapta al género y puede desalinearse si cambias el tempo mientras suena.

Usa auriculares o volumen moderado para la primera prueba. El navegador puede no admitir todos los formatos.

