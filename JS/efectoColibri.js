document.addEventListener("DOMContentLoaded", () => {
    // 1. Configuración básica de Three.js
    const scene = new THREE.Scene();
    
    // Cámara
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    // Renderizador transparente
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Configurar color de salida correcto para modelos GLTF
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '9999';
    renderer.domElement.style.pointerEvents = 'none'; // Importante para no bloquear clics
    document.body.appendChild(renderer.domElement);

    // 2. Luces para modelos realistas
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // 3. Cargar el Modelo GLTF del Loro Fotorealista
    let parrotModel;
    let mixer; // Para la animación del aleteo
    
    const loader = new THREE.GLTFLoader();
    // Usamos el Loro oficial de los ejemplos de Three.js
    const modelUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Parrot.glb';

    loader.load(
        modelUrl,
        function (gltf) {
            parrotModel = gltf.scene;
            
            // Aumentar el tamaño para que sea muy visible y "realista" en la pantalla
            parrotModel.scale.set(0.12, 0.12, 0.12);
            
            scene.add(parrotModel);

            // Iniciar la animación que viene dentro del archivo GLTF
            mixer = new THREE.AnimationMixer(parrotModel);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
        },
        undefined,
        function (error) {
            console.error('Error al cargar el modelo del loro:', error);
        }
    );

    // 4. Animación y Movimiento
    const clock = new THREE.Clock();

    // Función para calcular la trayectoria de vuelo fluida
    function getPathPosition(t) {
        const aspect = window.innerWidth / window.innerHeight;
        const radiusX = 18 * aspect; // Amplitud en X
        const radiusY = 10;          // Amplitud en Y
        const radiusZ = 12;          // Profundidad
        
        // Movimiento complejo usando curvas senoidales combinadas
        const x = Math.sin(t * 0.4) * radiusX + Math.sin(t * 0.8) * 3;
        const y = Math.cos(t * 0.3) * radiusY + Math.sin(t * 1.5) * 2;
        const z = Math.sin(t * 0.5) * radiusZ;
        
        return new THREE.Vector3(x, y, z);
    }

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const t = clock.getElapsedTime();

        // Actualizar el aleteo del modelo (si ya cargó)
        if (mixer) {
            // El multiplicador (2.0) hace que aletee más rápido
            mixer.update(delta * 2.0);
        }

        // Mover el pájaro por la pantalla
        if (parrotModel) {
            const flightSpeed = 0.6; // Velocidad de vuelo
            const currentPos = getPathPosition(t * flightSpeed);
            const nextPos = getPathPosition((t + 0.1) * flightSpeed); // Mirar un poco adelante

            // Mover hacia la posición actual
            parrotModel.position.copy(currentPos);
            
            // Hacer que mire hacia adonde se dirige
            parrotModel.lookAt(nextPos);
            
            // Inclinación aerodinámica al girar (Bank angle)
            const dx = nextPos.x - currentPos.x;
            // El modelo del loro puede tener una orientación diferente por defecto, 
            // ajustamos la rotación en Z para que se incline al dar la vuelta
            parrotModel.rotation.z -= dx * 0.3;
        }

        renderer.render(scene, camera);
    }

    // 5. Manejo de redimensionamiento de ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Iniciar animación principal
    animate();
});
