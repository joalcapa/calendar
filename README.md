# Calendar APP

# DEMO LIVE VERCEL
Calendar APP esta desplegado en VERCEL, con la siguiente URL:

https://calendar-beige-sigma.vercel.app/

![image GIF Meuler](https://dl.dropboxusercontent.com/scl/fi/bycsyzdtm3yp11b2cfoog/Calendar1.gif?rlkey=xv42jj0vwh5w4e3jqyzthwkxr&st=3ua8vl4j)

Esta aplicación web está construida con Next.js v14 y se conecta a una base de datos PostgreSQL mediante Prisma. 
Consume servicios de clima de un proveedor externo, permitiendo a los usuarios acceder a datos meteorológicos en tiempo real de manera eficiente y sencilla,
además con los datos meteorológicos poder crear eventos en su calendario, permitiendo filtrar los eventos por vistas de mes, semana y día.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Características

- Conexión a una base de datos PostgreSQL.
- Interacción con la base de datos utilizando Prisma como ORM.
- Renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG) con Next.js.
- Uso de **React Query** para sincronizar eventos entre el lado del cliente y el servidor.

## Tecnologías

- [Next.js](https://nextjs.org/) - Framework de React para aplicaciones web.
- [PostgreSQL](https://www.postgresql.org/) - Sistema de gestión de bases de datos.
- [Prisma](https://www.prisma.io/) - ORM para TypeScript y Node.js.
- [React Query](https://tanstack.com/query/latest) - Herramienta para la gestión de estado y sincronización de datos en el cliente.
- [Jest](https://jestjs.io/) - Framework de pruebas para JavaScript.
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) - Biblioteca para pruebas de componentes de React.
- [React DnD](https://react-dnd.github.io/react-dnd/about) - Biblioteca para implementar funcionalidad de Drag and Drop en aplicaciones React.
- [Node.js](https://nodejs.org/) - Entorno de ejecución para JavaScript.
- [TypeScript](https://www.typescriptlang.org/) - Superconjunto de JavaScript.

## Instalación

Este proyecto se puede ejecutar utilizando Docker. A continuación, se describen los pasos necesarios para configurar y ejecutar la aplicación.

### Requisitos Previos

Asegúrate de tener [Docker](https://www.docker.com/get-started) y [Docker Compose](https://docs.docker.com/compose/install/) instalados en tu sistema.

### Configuración

Estos son los archivos de configuarción necesarios para probar la aplicación Calendar:

- `Dockerfile`
- `docker-compose.yml`
- `.env`
- `app/config/env.ts`

### Archivos de Configuración

#### `Dockerfile`

Este archivo configura la imagen de Docker para que puedas usar Calendar APP. Utiliza Node.js como base y establece el directorio de trabajo, instala las dependencias y configura el entorno de producción.

#### `docker-compose.yml`

El archivo `docker-compose.yml` define los servicios necesarios para ejecutar la aplicación. Incluye:

- Un contenedor para **PostgreSQL**.
- Un contenedor para **Next.js**, que depende de PostgreSQL.

Asegúrate de que las variables de entorno en `docker-compose.yml` coincidan con las del archivo `.env` para que la aplicación funcione correctamente:

```yaml
environment:
  DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/calendar?schema=public"
  WEATHER_URL: "https://api.weatherapi.com/v1/history.json"
  WEATHER_API_KEY: "YOUR_API_KEY"
  REACT_APP_PUBLIC_API_URL: "http://localhost:3000/api"
```

**NOTA**: La aplicación Calendar, esta diseñada para trabajar con el proveedor de datos metereologicos WEATHER API, puedes crearte una cuenta y obtener el API KEY (WEATHER_API_KEY) en: https://www.weatherapi.com/signup.aspx
- Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5433/calendar?schema=public"
WEATHER_URL="https://api.weatherapi.com/v1/history.json"
WEATHER_API_KEY="YOUR_TOKEN"
REACT_APP_PUBLIC_API_URL=http://localhost:3000/api
```

Asegúrate de que el archivo `.env` tenga las mismas variables que en el archivo `docker-compose.yml`, además Calendar APP cuenta con un archivo `.env.example` que sirve como referencia para las variables de entorno requeridas.

Crea un archivo `env.ts` en la carpeta app/config con el siguiente contenido:
```ts
export const ENV = "local";

export const API_URLS = {
    local: 'http://localhost:3000/api',
}
```

#### Script de Inicio
El archivo `start.sh` en la raíz del proyecto cuenta con los comandos necesario para correr las migraciones en el gestor de base de datos escogido, en este caso postgresql, tiene el siguiente contenido:
```
#!/bin/sh

# Ejecutar migraciones de Prisma
npm run migrate

# Iniciar la aplicación Next.js
npm run dev
```

#### Ejecuta la aplicación
Para iniciar los servicios, utiliza el siguiente comando en la raíz del proyecto:
```
docker-compose up --build
```
Esto construirá y levantará los contenedores definidos en docker-compose.yml. Una vez que los contenedores estén en funcionamiento, podrás acceder a la aplicación en http://localhost:3000.

## Estructura del Proyecto
```
calendar/  
    ├── mocks/ # Mocks para pruebas 
    ├── tests/ # Archivos de prueba 
    ├── app/ # Código de la aplicación Next.js 
    │ └── api
    │ │ └── events # Rutas CRUD para los eventos
    │ │ └── weather # Ruta get para los datos del clima
    │ └── components
    │ │ └── calendar # Set de componentes para el calendario
    │ │ └── dnd # Set de componentes drag and drop
    │ │ └── rq # Componente para la hidratación del estado del servidor para el cliente
    │ └── config
    │ │ └── env.ts # Configuración de la api url para el entorno
    │ └── day # Page del calendario tipo día
    │ └── fonts # Tipos de fuentes para el proyecto
    │ └── hooks # Set de custom hooks para manipular los eventos, navegación, entre otras
    │ └── lib # Operación de los eventos para react-query
    │ └── month # Page del calendario tipo mes
    │ └── services # Servicios para la comunicación con la API
    │ └── types # Interfaces TS
    │ └── utils # Utilidades para manejo de fechas
    │ └── week # Page del calendario de tipo mes
    │ └── page.tsx # Página principal 
    │ └── layout.tsx # Layout principal 
    │ └── global.css # CSS global 
    │ └──  page.tsx # Página principal 
    ├── libs/ # Librerías reutilizables 
    ├── prisma/ # Configuración de Prisma 
    ├── repositories/ # Repositorios para el acceso a datos 
    ├── services/ # Lógica de negocio 
    ├── types/ # Definiciones de tipos TypeScript 
    ├── utils/ # Funciones utilitarias 
    ├── .eslintrc.json # Configuración de ESLint 
    ├── Dockerfile # Dockerfile para contenerización 
    ├── docker-compose.yml # Configuración de Docker Compose 
    ├── jest.config.js # Configuración de Jest para pruebas 
    ├── next.config.mjs # Configuración de Next.js 
    ├── package.json # Dependencias y scripts del proyecto 
    ├── postcss.config.mjs # Configuración de PostCSS 
    ├── tailwind.config.ts # Configuración de Tailwind CSS 
    └── tsconfig.json # Configuración de TypeScript
```

### Descripción de Directorios y Archivos Clave

- **app/**: Contiene las páginas y componentes de la aplicación.
- **libs/**: Objeto Prisma Singleton que favorece la centralización a las llamadas a la base de datos.
- **prisma/**: Configuraciones y modelos de base de datos utilizados por Prisma.
- **repositories/**: Abstracción para interactuar con la base de datos, aquí podrás cambiar facilemnte el proveedor de la base datos.
- **services/**: Contiene la lógica de negocio, conectando los repositorios para exponer servicios para la API.
- **types/**: Definiciones de tipos TypeScript, mejorando la mantenibilidad y la legibilidad.
- **utils/**: Funciones auxiliares que son utilizadas en diferentes partes del proyecto.

## Uso

### Clonar el repositorio

Clona el repositorio y accede al directorio del proyecto:

```bash
git clone https://github.com/joalcapa/calendar.git
cd calendar
```

#### Instala dependencias
Ejecuta el siguiente comando para instalar todas las dependencias:

```bash
npm install
```

#### Configurar Prisma
Configura la base de datos con Prisma y ejecuta la migración:

```bash
npm run migrate
```

#### Ejecutar el proyecto
Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor estará disponible en http://localhost:3000.

#### Ejecutar test
Para ejecutar los tests:

```bash
npm run test
```

### Testing

Este proyecto cuenta con un enfoque sólido para garantizar la calidad mediante diversas pruebas, incluyendo pruebas de componentes, hooks, y funciones.

- **Total de tests**: 65 pruebas que pasan satisfactoriamente.
- **Mocks**: Se utilizan mocks personalizados ubicados en el directorio `__mocks__/` para simular datos y servicios externos.
- **Component Testing**: Pruebas de componentes React con **@testing-library/react**.
- **Hook Testing**: Pruebas específicas de hooks para garantizar su correcto comportamiento.
- **Jest**: Se utiliza **Jest** como el framework principal para las pruebas, con el entorno **jest-environment-jsdom**.

### Comando para ejecutar las pruebas

Para correr todas las pruebas:

```bash
npm run test
