# Documento de Cobertura y Estrategia de Testing — Evaluación Parcial 2 (EP2)
**Asignatura:** DSY1104 — Desarrollo Full Stack II  
**Proyecto:** Tienda Sonido Vivo (Catálogo y Gestión de Audio Profesional)  
**Semestre / Año:** Segundo Semestre 2026  
**Entorno Técnico:** React 18 + Vite + Vitest + React Testing Library  

---

## 1. Identificación del Entorno y Dependencias de Pruebas

En conformidad con las directrices de la **Guía 06 de Testing para la Evaluación Parcial 2**, el proyecto migró técnicamente de la pila tradicional (Jasmine/Karma) a la arquitectura moderna recomendada para aplicaciones basadas en **Vite**:

| Dependencia | Versión | Propósito Técnico en el Proyecto |
| :--- | :--- | :--- |
| **Vitest** | `^2.1.9` | Test Runner nativo de Vite. Ejecuta suites de pruebas en milisegundos con soporte directo para ESM, TypeScript y JSX sin transpilaciones lentas. |
| **@testing-library/react** | `^16.3.3` | Permite renderizar y consultar componentes React desde la perspectiva del usuario final (accesibilidad, textos y roles en lugar de detalles internos). |
| **@testing-library/jest-dom** | `^7.0.1` | Extiende los matchers de aserción (`toBeInTheDocument()`, `toHaveTextContent()`, `toHaveAttribute()`, etc.). |
| **@testing-library/user-event** | `^14.6.8` | Simulación realista de eventos del usuario en el navegador (tipeo secuencial, clics, selección de opciones). |
| **jsdom** | `^30.1.3` | Implementación en memoria del estándar DOM y HTML5 para simular el comportamiento del navegador dentro de Node.js. |
| **@vitest/coverage-v8** | `^2.1.9` | Colector de cobertura de código basado en el motor V8 nativo de Node.js para medir sentencias, ramas, funciones y líneas. |

### Comandos de Ejecución Estandarizados (package.json)
* `npm test`: Ejecuta toda la suite de pruebas unitarias una sola vez (`vitest run`).
* `npm run test:watch`: Ejecuta las pruebas en modo interactivo observando cambios en caliente (`vitest`).
* `npm run test:coverage`: Genera el reporte completo de cobertura por consola y exporta reportes HTML/JSON a la carpeta `coverage/` (`vitest run --coverage`).

---

## 2. Matriz de Pruebas Unitarias Implementadas (10 Pruebas Diversas)

Para alcanzar el máximo nivel de desempeño del indicador, se implementaron **10 pruebas unitarias efectivas**, distribuidas en 3 suites especializadas que cubren los 4 tipos de evidencia solicitados: **Lógica y Validaciones**, **Componentes y Props**, **Interacciones de Usuario** y **Mocks/Spies**.

| N° | Suite / Archivo | Tipo de Evidencia | Elemento Probado | Propósito y Comportamiento Verificado |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `productosStorage.test.js` | Lógica y Reglas de Negocio | `getProductos()` | Comprueba la inicialización automática del catálogo base con los 12 productos de audio cuando `localStorage` está vacío, validando tipos de datos y atributos esenciales. |
| **2** | `productosStorage.test.js` | Lógica y Persistencia | `createProducto()` | Verifica la asignación de un ID incremental único, la inserción del nuevo equipo al inicio de la colección y su persistencia real en `localStorage`. |
| **3** | `productosStorage.test.js` | Lógica y Mutación Controlada | `updateProducto()` | Valida la actualización selectiva de propiedades (nombre, precio) garantizando que el ID y el resto de los datos permanezcan inmutables. |
| **4** | `productosStorage.test.js` | Lógica y Eliminación | `deleteProducto()` | Asegura la remoción exacta del producto solicitado según su identificador numérico y verifica que consultas posteriores retornen `null`. |
| **5** | `productosStorage.test.js` | Lógica y Resiliencia | `resetProductos()` | Confirma que ante cualquier alteración previa (creaciones o borrados), la función restablece exactamente la colección inicial de 12 equipos de fábrica. |
| **6** | `ProductoCard.test.jsx` | Componentes y Props | `<ProductoCard />` | Renderiza el componente con datos simulados y comprueba que se exhiba el título en `<h3>`, la categoría, la imagen asociada y el precio formateado con puntuación chilena (`$ CLP`). |
| **7** | `ProductoCard.test.jsx` | Componentes y Fallback Visual | `<ProductoCard />` | Simula un evento `onError` en el elemento de imagen (`<img>`) y comprueba que la fuente cambie al placeholder vectorial por defecto (`/img/audio-placeholder.svg`). |
| **8** | `ProductoFormModal.test.jsx` | Validaciones y Reglas de Negocio | `<ProductoFormModal />` | Intenta guardar con el campo de nombre vacío; valida que se muestre el mensaje de error correspondiente y que se bloquee el envío (`onSave` no ejecutado). |
| **9** | `ProductoFormModal.test.jsx` | Validaciones y Rangos Numéricos | `<ProductoFormModal />` | Ingresa un precio inválido ($0 o menor); valida la activación del mensaje de advertencia y comprueba que se impida la persistencia de datos inconsistentes. |
| **10** | `ProductoFormModal.test.jsx` | Interacciones de Usuario y Spies | `<ProductoFormModal />` | Simula el flujo completo de escritura y selección de formulario mediante `userEvent`, comprobando con un Spy (`vi.fn()`) que `onSave` fue invocado con los argumentos exactos procesados. |

---

## 3. Relación con Componentes y Funcionalidades Reales del Proyecto

Cada una de las pruebas ataca directamente componentes críticos de la arquitectura de **Tienda Sonido Vivo**:

1. **Servicio Central de Almacenamiento (`src/services/productosStorage.js`):**  
   Es el núcleo del CRUD simulado del proyecto. Las pruebas 1 a 5 aseguran que el catálogo de audio funcione de forma determinista, evitando que errores de manipulación en el estado local corrompan la experiencia del usuario o el inventario administrativo.
2. **Tarjeta de Producto Reutilizable (`src/components/ProductoCard.jsx`):**  
   Componente visual nuclear del catálogo público (`/productos`). Las pruebas 6 y 7 garantizan que la presentación de la información comercial respete el formato de moneda nacional y que las fallas de carga de red no rompan la estética del sitio web.
3. **Modal de Creación y Edición (`src/components/ProductoFormModal.jsx`):**  
   Componente administrativo de alta interacción. Las pruebas 8 a 10 aseguran que los operadores no puedan ingresar registros corruptos (nombres vacíos o precios absurdos) y garantizan que la comunicación entre el formulario hijo y la vista padre (`Admin.jsx`) sea contractualmente exacta.

---

## 4. Justificación y Uso de Mocks y Spies

En la prueba **N° 10**, se implementó un **Spy** mediante `vi.fn()` de Vitest:

```javascript
const onSaveSpy = vi.fn();

render(
  <ProductoFormModal
    isOpen={true}
    onClose={vi.fn()}
    onSave={onSaveSpy}
    productoAEditar={null}
  />
);

// Interacción del usuario simulada
await user.type(inputNombre, "Monitores Yamaha HS8 Activos");
await user.selectOptions(selectCategoria, "Monitores y Parlantes");
await user.type(inputPrecio, "489990");
await user.click(botonGuardar);

// Aserciones sobre el Spy
expect(onSaveSpy).toHaveBeenCalledTimes(1);
expect(onSaveSpy).toHaveBeenCalledWith(
  expect.objectContaining({
    nombre: "Monitores Yamaha HS8 Activos",
    categoria: "Monitores y Parlantes",
    precio: 489990,
  })
);
```

### Justificación Técnica:
* **Aislamiento de Dependencias:** El componente modal tiene una responsabilidad única: recolectar y validar datos de usuario. No le corresponde saber si los datos se guardarán en `localStorage`, en una API REST o en Firebase.
* **Verificación de Contrato:** El spy permite auditar con precisión quirúrgica que el evento de confirmación se ejecutó una única vez y que los tipos de datos enviados correspondan a las expectativas (por ejemplo, que el precio haya sido casteado de `string` a `number`).
* En las pruebas 8 y 9, el mismo spy se utilizó de forma negativa (`expect(onSaveMock).not.toHaveBeenCalled()`), demostrando que el formulario previene la propagación de datos no válidos.

---

## 5. Resultados de Ejecución y Métricas de Cobertura

### Resumen de Ejecución (`npm test`)
```text
 ✓ src/test/productosStorage.test.js (5 tests)
 ✓ src/test/ProductoCard.test.jsx (2 tests)
 ✓ src/test/ProductoFormModal.test.jsx (3 tests)

 Test Files  3 passed (3)
      Tests  10 passed (10)
   Duration  2.95s
```

### Reporte de Cobertura V8 (`npm run test:coverage`)
```text
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   30.01 |    52.63 |   53.84 |   30.01 |                   
 src/components    |   72.22 |    69.56 |   61.53 |   72.22 |                   
  ProductoCard.jsx |     100 |      100 |     100 |     100 |                   
  ...FormModal.jsx |   95.32 |    77.77 |      75 |   95.32 | 49-52,99,179-181  
 src/services      |   95.77 |    51.85 |     100 |   95.77 |                   
  ...tosStorage.js |   95.77 |    51.85 |     100 |   95.77 | 21-23             
-------------------|---------|----------|---------|---------|-------------------
```

---

## 6. Análisis Crítico de Cobertura y Oportunidades de Mejora

### Módulos con Cobertura Crítica Excelente:
1. **`ProductoCard.jsx` (100% Cobertura):** Cada línea de código, función de renderizado y rama condicional (incluyendo el manejador de fallos de imagen) está cubierta y protegida contra regresiones.
2. **`productosStorage.js` (95.77% Líneas, 100% Funciones):** La lógica de negocio está prácticamente blindada. Las únicas líneas no ejecutadas corresponden a los bloques `catch` de excepciones extremas de serialización JSON.
3. **`ProductoFormModal.jsx` (95.32% Líneas):** El ciclo de vida de validaciones, captura de teclado y emisión de eventos fue testeado exhaustivamente.

### Oportunidades de Mejora para Próximas Iteraciones:
* **Vistas de Contenedor (`Admin.jsx`, `Productos.jsx`, `Inicio.jsx`):** Estas vistas operan como páginas integradoras de alto nivel. Para cubrirlas en una futura etapa (Evaluación Final), se recomienda incorporar pruebas de integración extremo a extremo (E2E) con Playwright o Cypress para testear la navegación entre rutas con React Router.
* **Componentes de Layout (`Header.jsx`, `Navbar.jsx`, `Footer.jsx`):** Al ser componentes puramente estáticos y declarativos, su riesgo de fallo operativo es marginal, por lo que priorizar las pruebas en componentes con estado y formularios fue la decisión técnica más eficiente para el alcance de EP2.

---

## 7. Conclusiones Técnicas

1. **Modernización Exitosa:** La adopción de **Vitest** en sustitución de Jasmine/Karma redujo significativamente la complejidad de configuración y permitió una integración fluida con la infraestructura de Vite, manteniendo al mismo tiempo una sintaxis declarativa, limpia y familiar.
2. **Efectividad sobre Cantidad:** Las 10 pruebas unitarias diseñadas no son repeticiones triviales; cada una aporta valor concreto comprobando escenarios positivos, casos de borde (validación de campos vacíos y valores numéricos no permitidos) y resiliencia ante errores de red.
3. **Calidad de Software Asegurada:** La suite de pruebas actual ofrece garantías sólidas de que el catálogo y el panel administrativo de **Tienda Sonido Vivo** pueden presentarse y operarse sin contratiempos durante la demostración en vivo de la Evaluación Parcial 2.
