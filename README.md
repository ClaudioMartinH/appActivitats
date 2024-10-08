# Prueba de Acceso - Hackathon Cibernarium 22@ del Saló de l'Ocupació

## Backend - AppActivitats

Aquest projecte és la prova tècnica per poder accedir a la Hackhathó del Cibernàrium pel Saló de l'Ocupació 2024.
Consisteix en una aplicació de gestió d'activitats, en la qual ens podem registrar com a usuaris, accedir-hi, podem crear activitats, ens hi podem apuntar o desapuntar, podem eliminar tasques i usuaris, i podem editar usuaris tambe.
Com a requisits ens demanaven poder pujar arxius en format .JOSN o be descarregar en format .JSON totes les activitats de la base de dades.
El backend està desenvolupat amb **NodeJS** i **Express**, la base de dades es de **MongoDB**

### Autor

Claudio Martin Herranz

## Requisits

- **Node.js** (v20.17.0 o superior)
- **MongoDB** (Instancia local o remota)
- **npm** (v7.0.0 o superior)

## Instal·lació

1. **Clonar el repositori**:

   ```bash
    git clone https://github.com/ClaudioMartinH/prova_hackato_SO_appActivitats.git
   
    cd appActivitats
   ```

2. **Instal#lar les dependències, compilar el projecte i arrencar el servidor**:

    ```bash
      npm run start 
    ```

3. **Configurar l'entorno**:

    Crea un arxiu `` .env `` en la carpeta `` /backend `` del projecte amb les següents variables d'entorn:

    ```bash
      PORT=3000
      MONGO_DB_URI=tu-usuario-y-contraseña-de-mongodb-y-elcluster-app
    ```

    El servidor estarà disponible a <http://localhost:3000>

    L'String de connexió a la meva base de dades mongoDB serà al mail on adjunto l'enllaç al repositori.
    Només caldrà copiar el text a l'arxiu `` .env ``

   ## Dependències

        Producció

          - bcryptjs: Encriptació de contrasenyes.
          - cors: Control d'accés entre dominis.
          - express: Framework de servidor.
          - helmet: Seguretat HTTP.
          - mongodb: Driver oficial de MongoDB.
          - mongoose: ODM per a MongoDB.
          - multer: Gestió d'arxius.

        Desenvolupament

          - typescript: Suport per a TypeScript.
          - nodemon: Recàrrega automàtica durant el desenvolupament.
          - dotenv: Maneig de variables d'entorn.
          - eslint: Eina per assegurar la qualitat del codi.

   ## Funcions

        Rutes Principals

          - <http://localhost:3000/api/login>: -> Ruta per al login d'usuaris.
          - <http://localhost:3000/api/register>: Ruta per al registre d'usuaris.
          - <http://localhost:3000/api/appActivitats/main>: Ruta per a la pàgina principal de l'aplicació.

   ## Middleware  

          - CORS: S'assegura que les peticions des d'altres dominis siguin permeses segons les polítiques configurades.
          - Helmet: Afegeix capçaleres HTTP de seguretat per mitigar possibles atacs.
          - Morgan: Registra les peticions HTTP a la consola per facilitar la depuració.
          
   ## Connexió a MongoDB

          - El servidor es connecta automàticament a MongoDB quan s'inicia. Si la connexió falla, es mostrarà un missatge d'error a la consola.

   ## Gestió d'Errors

          - El middleware errorHandler s'encarrega de capturar qualsevol error que ocorri al servidor i retornar una resposta adequada al client.

   ## Execució en Desenvolupament

      Per a un entorn de desenvolupament, pots executar:

      ```bash
      npm run dev
      ```

#### Això iniciarà el servidor amb nodemon, el que permetrà recarregar automàticament el servidor quan realitzis canvios al codi

# Requisits tècnics de la prova

```java

    Requisits tècnics
    
        1. Gestió d'Usuaris: Pots utilitzar les dades dels usuaris que consideris: nom, cognoms, edad, email...
        
          • Registre de nous usuaris
          • Actualització de dades de l'usuari:
          • Eliminació d'usuaris
          • Consulta d'informació d'usuaris

        2. Gestió d'activitats:
        
          • Creació d'una nova activitat
          • Consulta d'activitats
          • Apuntar-se a una activitat
      
        3. Exportació d'activitats:

          • Exportar activitats en format JSON

        4. Importació d'activitats:
        
          • Importar activitats des d'un arxiu JSON

        5. Configuració de la Base de Dades:
          
          • Establir una connexió amb una base de dades, que pot ser MySQL o MongoDB, per     emmagatzemar les dades d'usuaris i activitats.

    Endpoints de l’API Demanats
      
      Aquí teniu l’exemple dels endpoints de l’apartat d’usuaris, crea els endpoints necessaris per gestionar la resta de l’aplicació.

        - Usuaris:
          
          • GET /appActivitats/users/:id: Consulta de la informació d'un usuari. ✅
          • POST /appActivitats/user: Registre d'un nou usuari. ✅
          • PUT /appActivitats/users/:id: Actualització de les dades d'un usuari. ✅
          • DELETE /appActivitats/users/:id: Eliminació d'un usuari. ✅

    Endpoints de l'API creats per mi:

        - Usuaris:
          
          • GET /appActivitats/users/search/:name : Fa una cerca a la base de dades pel nom de l'usuari donat.
          • GET /appActivitats/users/ : Retorna tots els usuaris que hi han enregistrats a la base de dades
          • POST /appActivitats/user/login : Permet accedir a l'app
    
        - Activitats:

          • POST /appActivitats/task : Registre d'una nova tasca
          • GET /appActivitats/tasks : Recupera totes les tasques a la base de dades
          • GET /appActivitats/tasks/:id : Recupera la tasca amb l'ID que li passe,
          • PUT /appActivitats/tasks/:id : Actualitza una tasca a partir de la cerca per id
          • POST /appActivitats/tasks/:taskId/join : Permet a l'usuari registrarse en l'activitat
          • DELETE /appActivitats/tasks/:taskId/remove/:participantId : Elimina usuari de l'activitat
          • DELETE /appActivitats/tasks/:taskId : Elimina una activitat
          • GET /appActivitats/download : permet descarregar en format JSON la llista de tasques de la base de dades amb els seus participants
          • POST /appActivitats/tasks/upload : Permet carregar un llistat de tasques en format JSON i el desa a la carpeta uploads
          

