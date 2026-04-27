document.addEventListener("DOMContentLoaded", () => {
    // 1. Configuración básica de Three.js
    const scene = new THREE.Scene();
    
    // Cámara
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    // Renderizador transparente
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '9999';
    renderer.domElement.style.pointerEvents = 'none'; // Importante para no bloquear clics
    document.body.appendChild(renderer.domElement);

    // 2. Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Luz ambiental suave
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // 3. Materiales basados en la paleta (Verde y Crema)
    const greenMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2e8b57, // Verde esmeralda/bosque
        roughness: 0.5,
        metalness: 0.1 
    });
    const creamMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xfffdd0, // Crema
        roughness: 0.8,
        metalness: 0.1 
    });
    const darkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111 // Para el pico/ojos
    });

    // 4. Construcción del Colibrí (Group)
    const hummingbird = new THREE.Group();

    // Cuerpo (Cono redondeado o cilindro)
    const bodyGeometry = new THREE.ConeGeometry(0.8, 3, 8);
    bodyGeometry.rotateX(Math.PI / 2); // Orientar horizontalmente
    const body = new THREE.Mesh(bodyGeometry, greenMaterial);
    hummingbird.add(body);

    // Cabeza (Esfera)
    const headGeometry = new THREE.SphereGeometry(0.7, 8, 8);
    const head = new THREE.Mesh(headGeometry, greenMaterial);
    head.position.set(0, 0.2, 1.2);
    hummingbird.add(head);

    // Pecho (Esfera aplastada, crema)
    const chestGeometry = new THREE.SphereGeometry(0.75, 8, 8);
    const chest = new THREE.Mesh(chestGeometry, creamMaterial);
    chest.scale.set(1, 0.8, 1.2);
    chest.position.set(0, -0.3, 0.5);
    hummingbird.add(chest);

    // Pico (Cono muy delgado)
    const beakGeometry = new THREE.ConeGeometry(0.08, 1.5, 8);
    beakGeometry.rotateX(Math.PI / 2);
    const beak = new THREE.Mesh(beakGeometry, darkMaterial);
    beak.position.set(0, 0.2, 2.5);
    hummingbird.add(beak);

    // Ojos
    const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const rightEye = new THREE.Mesh(eyeGeometry, darkMaterial);
    rightEye.position.set(0.3, 0.4, 1.5);
    const leftEye = new THREE.Mesh(eyeGeometry, darkMaterial);
    leftEye.position.set(-0.3, 0.4, 1.5);
    hummingbird.add(rightEye);
    hummingbird.add(leftEye);

    // Cola (Cono plano)
    const tailGeometry = new THREE.ConeGeometry(0.6, 2, 3);
    tailGeometry.rotateX(-Math.PI / 2);
    const tail = new THREE.Mesh(tailGeometry, greenMaterial);
    tail.scale.set(1, 0.2, 1);
    tail.position.set(0, 0, -2);
    hummingbird.add(tail);

    // Alas (Estructura de pivote para poder aletear desde la base)
    const wingGeometry = new THREE.ConeGeometry(0.5, 3, 3);
    wingGeometry.rotateZ(Math.PI / 2); // Acostar el cono
    
    // Ala derecha
    const rightWingPivot = new THREE.Group();
    rightWingPivot.position.set(0.5, 0.2, 0.5);
    const rightWing = new THREE.Mesh(wingGeometry, creamMaterial);
    rightWing.scale.set(1, 0.1, 1);
    rightWing.position.set(1.5, 0, 0); // Desplazar el ala del pivote
    rightWingPivot.add(rightWing);
    hummingbird.add(rightWingPivot);

    // Ala izquierda
    const leftWingPivot = new THREE.Group();
    leftWingPivot.position.set(-0.5, 0.2, 0.5);
    const leftWing = new THREE.Mesh(wingGeometry, creamMaterial);
    leftWing.scale.set(1, 0.1, 1);
    leftWing.rotation.x = Math.PI; // Voltear para que sea simétrica
    leftWing.position.set(-1.5, 0, 0);
    leftWingPivot.add(leftWing);
    hummingbird.add(leftWingPivot);

    // Ajustar escala global del colibrí
    hummingbird.scale.set(0.5, 0.5, 0.5);
    scene.add(hummingbird);

    // 5. Animación y Movimiento
    const clock = new THREE.Clock();

    // Función para calcular la trayectoria en 3D (Curva de Lissajous + offset de scroll)
    function getPathPosition(t) {
        // Obtenemos los límites basados en el aspecto
        const aspect = window.innerWidth / window.innerHeight;
        const radiusX = 15 * aspect; // Amplitud en X
        const radiusY = 8;  // Amplitud en Y
        const radiusZ = 10; // Amplitud en profundidad Z

        const x = Math.sin(t * 0.5) * radiusX + Math.sin(t * 1.2) * 2;
        const y = Math.cos(t * 0.4) * radiusY + Math.sin(t * 2) * 1;
        const z = Math.sin(t * 0.3) * radiusZ;
        
        return new THREE.Vector3(x, y, z);
    }

    function animate() {
        requestAnimationFrame(animate);

        const t = clock.getElapsedTime();

        // Aleteo rápido (frecuencia alta)
        const wingFlapSpeed = 40;
        const flapAngle = Math.sin(t * wingFlapSpeed) * (Math.PI / 3); // Rango de aleteo
        rightWingPivot.rotation.z = flapAngle;
        leftWingPivot.rotation.z = -flapAngle;

        // Movimiento de la cola ligero
        tail.rotation.x = Math.sin(t * 10) * 0.1 - Math.PI / 2;

        // Movimiento del cuerpo (respiración/hovering)
        hummingbird.position.y += Math.sin(t * 5) * 0.01;

        // Trayectoria de vuelo
        const flightTime = t * 0.5; // Velocidad general de vuelo
        const currentPos = getPathPosition(flightTime);
        const nextPos = getPathPosition(flightTime + 0.05); // Mirar un poco adelante

        // Suavizar el movimiento del colibrí hacia la trayectoria
        hummingbird.position.lerp(currentPos, 0.1);
        
        // Hacer que mire hacia la dirección a la que vuela
        hummingbird.lookAt(nextPos);
        
        // Inclinar un poco al girar (Bank angle) basado en el movimiento X
        const dx = nextPos.x - currentPos.x;
        hummingbird.rotation.z = -dx * 0.5;

        renderer.render(scene, camera);
    }

    // 6. Manejo de redimensionamiento de ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Iniciar animación
    animate();
});
