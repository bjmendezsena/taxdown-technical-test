### Configuración Local

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local:

1. Clona el repositorio:

   ```bash
   git clone    git clone URL_ADDRESS.com/your-username/taxdown-technical-test.git
   cd taxdown-technical-test
   ```

2. Instala las dependencias:

   - **pnpm**

   ```bash
   pnpm install
   ```

3. Copia el archivo de variables de entorno de ejemplo:

   ```bash
   cp .env.template .env
   ```

   Edita el archivo `.env` con tus configuraciones locales si es necesario.

4. Levanta los servicios de Docker necesarios para el desarrollo:

   ```bash
   docker-compose -f docker/docker-compose.base.yml up -d
   ```

5. Ejecuta las migraciones de la base de datos:

   ```bash
   npx prisma migrate dev
   ```

6. Inicia la aplicación en modo de desarrollo:

   ````

   - **pnpm**

   ```bash
   pnpm dev
   ````

La aplicación ahora debería estar corriendo en `http://localhost:3000`.

- Suagger: `http://localhost:3000/api`.
