# Prompts Iniciales - Candidate Management System

Este documento recoge los prompts principales utilizados durante el desarrollo del sistema de gestión de candidatos, organizados cronológicamente y por categorías.

## 1. Prompts de Arquitectura y Planificación Inicial

### Prompt Fundacional
```
Necesito crear una aplicación web para gestión de candidatos con las siguientes características:
- Frontend en React con TypeScript
- Backend en Node.js/Express con TypeScript
- Base de datos relacional
- Funcionalidades: añadir candidatos, ver dashboard, subir CVs
- Arquitectura limpia y escalable

¿Puedes ayudarme a definir la estructura del proyecto y las tecnologías recomendadas?
```

### Prompt de Estructura de Carpetas
```
Define una estructura de carpetas profesional para este proyecto que incluya:
- Separación clara entre frontend y backend
- Arquitectura hexagonal en el backend
- Organización de componentes en React
- Configuración de TypeScript para ambos
```

### Prompt de Tecnologías
```
Para el stack tecnológico propuesto (React + Express + TypeScript), ¿qué herramientas adicionales recomiendas para:
- ORM/Base de datos (considerando PostgreSQL)
- Manejo de archivos (upload de CVs)
- Styling (CSS framework)
- Testing
- Build tools y configuración
```

## 2. Prompts de Configuración e Inicialización

### Prompt de Configuración Backend
```
Ayúdame a configurar el backend con:
- Express + TypeScript
- Prisma como ORM para PostgreSQL
- Configuración de CORS
- Estructura de rutas
- Middleware para manejo de archivos
- Configuración de variables de entorno
```

### Prompt de Configuración Frontend
```
Configura el frontend React con:
- Create React App + TypeScript
- React Router para navegación
- Configuración de proxy para desarrollo
- Estructura de componentes y páginas
- Configuración de estilos con TailwindCSS
```

### Prompt de Base de Datos
```
Define el esquema de base de datos para el sistema de candidatos con Prisma:
- Entidad Candidate con campos: nombre, apellido, email, teléfono, dirección, educación, experiencia, archivo CV
- Relaciones si es necesario
- Validaciones a nivel de base de datos
- Migraciones iniciales
```

## 3. Prompts de Desarrollo de Funcionalidades

### Prompt de Entidades y Dominio
```
Implementa la arquitectura hexagonal para el backend:
- Entidad Candidate en el dominio
- Repository pattern para persistencia
- Casos de uso para AddCandidate y GetAllCandidates
- Separación clara entre capas de dominio, aplicación e infraestructura
```

### Prompt de Componente Formulario
```
Crea un componente React profesional para añadir candidatos que incluya:
- Formulario con todos los campos requeridos
- Validación en tiempo real
- Manejo de estado con hooks
- Upload de archivos CV con drag & drop
- Feedback visual (loading, errores, éxito)
- Navegación entre páginas
```

### Prompt de Dashboard
```
Desarrolla un componente Dashboard que muestre:
- Lista de todos los candidatos en formato tabla
- Información completa de cada candidato
- Enlaces para descargar CVs
- Estado de carga y manejo de errores
- Navegación al formulario de añadir candidato
- Diseño responsive y profesional
```

## 4. Prompts de Resolución de Problemas

### Prompt de Depuración TailwindCSS
```
Estoy teniendo el siguiente error con TailwindCSS y PostCSS:
[ERROR COMPLETO DEL STACK TRACE]

El error indica problemas de compatibilidad entre versiones. ¿Puedes ayudarme a:
1. Diagnosticar la causa
2. Proponer soluciones alternativas
3. Si es necesario, migrar a CSS puro manteniendo el diseño
```

### Prompt de Debugging Backend
```
El backend está devolviendo error 400 al crear candidatos. Necesito:
1. Configurar debug en VS Code para TypeScript
2. Instrucciones paso a paso para lanzar frontend y backend
3. Cómo conectar el debugger y poner breakpoints
4. Identificar si el problema está en validación, datos o configuración
```

### Prompt de Errores de Renderizado React
```
Estoy obteniendo este error en React:
"Objects are not valid as a React child (found: object with keys {value})"

El error ocurre en el componente Dashboard, específicamente en elementos <td>. 
¿Puedes ayudarme a:
1. Identificar la causa raíz
2. Revisar cómo estoy renderizando los datos
3. Corregir el formato de datos del backend si es necesario
```

## 5. Prompts de Mejora y Refactoring

### Prompt de Migración de Estilos
```
Dado que TailwindCSS está causando problemas de configuración, ayúdame a:
1. Eliminar completamente las dependencias de Tailwind
2. Crear estilos CSS puros profesionales
3. Mantener el mismo diseño y funcionalidad
4. Asegurar que todos los componentes usen las nuevas clases CSS
```

### Prompt de Análisis de Código
```
Analiza el proyecto completo para detectar:
1. Componentes no utilizados
2. Imports innecesarios
3. Problemas de estilo de código
4. Warnings o errores potenciales
5. Oportunidades de mejora en la estructura
```

### Prompt de Profesionalización de UI
```
El diseño actual es funcional pero necesita verse más profesional. Ayúdame a:
1. Mejorar los estilos CSS con un diseño moderno
2. Añadir estados visuales (hover, focus, loading)
3. Mejorar la responsividad
4. Crear una paleta de colores consistente
5. Añadir iconos y elementos visuales apropiados
```

## 6. Prompts de Configuración de Herramientas

### Prompt de Configuración de Debug
```
Necesito configurar VS Code para depurar correctamente el backend TypeScript:
1. Configuración de launch.json
2. Source maps para mapear TS a JS
3. Instrucciones para compilar y ejecutar en modo debug
4. Cómo conectar el debugger y usar breakpoints efectivamente
```

### Prompt de Configuración de Proyecto
```
Ayúdame a crear los archivos de configuración necesarios:
- tsconfig.json para backend y frontend
- .env templates con variables requeridas
- .gitignore apropiado para el proyecto
- Scripts de npm para desarrollo y producción
- Documentación básica del proyecto
```