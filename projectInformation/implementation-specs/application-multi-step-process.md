#   1. Contexto de la screen

    evento/:id/aplicar
    Esta screen tiene como finalidad representar el proceso de aplicación de una empresa hacia otra que publica un evento en la plataforma. Consta de 3 fases.
    fase 1: Despliegue de formulario con las preguntas personalizadas del dueño del evento
    fase 2: Representacion de un estado de pending donde se el comunica al usuario activamente que su aplicacion/solicitud esta en proceso de ser revisada, con una screen de icono mas friendly message
    fase 3: cuando el dueño del evento actualiza el estado de la aplicacion de pending a aceptada, se despliega una interfaz de chat donde el usuario puede comunicarse con el dueño del evento.
    fase 3: en caso de que la solicitud sea rechazada, se le debe dar feedback al usuario de manera simple, con el icono y el mensaje de que su postulacion fue rechazada y un boton hacia eventos
    
#   2. ENTIDADES DE DOMINIO AFECTADAS

    Application	        Postulación del usuario al evento
    ApplicationScore	Score calculado por scoring rules
    ScoreBreakdown	    Desglose del score por regla
    ContactRequest	    Solicitud de contacto (chat)
    Message	            Mensajes del chat
    ScoringRule	        Reglas de scoring del evento    

#   3. API CONTRACTS

    FASE 1 — Aplicar al evento

        GET /api/events/:eventId/scoring-rules
        REQUIRE-AUTH: false (público, el formulario lo carga antes de autenticar)
            -> primera parte del form, cargo las scoring rules del dueño del evento
        Success 200:
        {
        "success": true,
        "data": [
            {
            "id": "string",
            "eventId": "string",
            "ruleType": "YEARS_EXPERIENCE",
            "weight": 1,
            "config": null,
            "createdAt": "Date"
            }
            ]
        }

        *IMPORTANTE*

        Este endpoint me obtiene las reglas del evento para puntuar postulantes, el objetivo de esto es saber
        que fields van a haber disponibles en el formulario en el step1, por lo que aca en el frontend debes mapear 
        esta estructura esperada hacia esto:

        ruleType	                Grupo	Frontend input	Qué renderiza	scoringFieldValues que envía
        VERIFIED_PROFILE	    perfil	—		No renderiza (se evalúa del profile automáticamente)	no va
        SAME_REGION	            ubicacion	—		No renderiza (se evalúa del profile automáticamente)	no va
        HAS_PORTFOLIO	        perfil	Toggle	        "¿Tenés portfolio?"	                    { "HAS_PORTFOLIO": true } o no va
        YEARS_EXPERIENCE	    perfil	Number input	    "¿Cuántos años de experiencia?"	        { "YEARS_EXPERIENCE": 5 }
        HAS_WEBSITE	            perfil	Toggle	        "¿Tenés sitio web?"	                    { "HAS_WEBSITE": true } o no va
        HAS_SOCIAL_LINKS	    perfil	Toggle	        "¿Tenés redes sociales?"	                { "HAS_SOCIAL_LINKS": true } o no va
        HAS_COMPANY_DESCRIPTION	perfil	Toggle	        "¿Tenés descripción empresarial?"	    { "HAS_COMPANY_DESCRIPTION": true } o no va
        HAS_LOGO	            perfil	Toggle	        "¿Tenés logo?"	                        { "HAS_LOGO": true } o no va
        HAS_BANNER	            perfil	Toggle	        "¿Tenés banner?"	                        { "HAS_BANNER": true } o no va
        HAS_PREVIOUS_FEEDBACK	historial	Toggle	        "¿Tenés feedback previo?"	            { "HAS_PREVIOUS_FEEDBACK": true } o no va
        AVERAGE_RATING	historial	Number input (0-5)	"¿Cuál es tu calificación promedio?"	    { "AVERAGE_RATING": 4.5 }
        NUMBER_OF_COMPLETED_JOBS	historial	Number input	"¿Cuántos trabajos completaste?"	    { "NUMBER_OF_COMPLETED_JOBS": 12 }
        NUMBER_OF_COMPLETED_EVENTS	historial	Number input	"¿Cuántos eventos completaste?"	{ "NUMBER_OF_COMPLETED_EVENTS": 3 }
        HAS_RESPONSE_HISTORY	historial	Toggle	"¿Tenés historial de respuestas?"	{ "HAS_RESPONSE_HISTORY": true } o no va
        FAST_RESPONSE_TIME	historial	Toggle	"¿Tu tiempo de respuesta es rápido?"	{ "FAST_RESPONSE_TIME": true } o no va
        IS_PREMIUM_COMPANY	premium	—	No renderiza (se evalúa del profile automáticamente)	no va
        CUSTOM_FIELD_MATCH	custom	Text input / Select	Texto libre o dropdown según config	{ "CUSTOM_FIELD_MATCH": { "fieldId": "abc", "value": "respuesta" } }

        Entonces dependiendo del ruleType obtenido del endpoint anterio, renderizas el tipo de field. Para esto crea una funcion maper en lib/domain que represente este mapeo


        Reglas de este flujo: Las reglas que se evalúan automáticamente del profile del usuario (VERIFIED_PROFILE, SAME_REGION, IS_PREMIUM_COMPANY) no se renderizan en el form. El backend las resuelve solo al crear la aplicación usando computeScoreUseCase:
            - VERIFIED_PROFILE → chequea user.emailVerified
            - SAME_REGION → compara profile.locationId con event.locationId
            - IS_PREMIUM_COMPANY → chequea suscripción premium del usuario


        POST /api/applications
        REQUIRE-AUTH: true
        Request Body:
        {
        "eventId": "string (required)",
        "coverLetter": "string | null (max 5000)",
        "portfolioUrls": ["string (url valid, max 10)"],
        "scoringFieldValues": {
            "YEARS_EXPERIENCE": 5,
            "CUSTOM_FIELD_MATCH": { "fieldId": "abc", "value": "respuesta del postulante" }
        }
        }
        Success 201:
        {
        "success": true,
        "data": {
            "id": "string",
            "eventId": "string",
            "applicantProfileId": "string",
            "coverLetter": "string | null",
            "portfolioUrls": ["string"],
            "scoringFieldValues": { "YEARS_EXPERIENCE": 5 },
            "status": "pending",
            "score": {
            "totalScore": 8,
            "maxPossible": 15,
            "computedAt": "Date",
            "breakdown": [
                {
                "ruleType": "YEARS_EXPERIENCE",
                "pointsEarned": 5,
                "pointsPossible": 5,
                "reason": "5 años de experiencia"
                }
            ]
            },
            "createdAt": "Date",
            "updatedAt": "Date"
        }
        }

        GET /api/mis-aplicaciones
            REQUIRE-AUTH: true
            Success 200:
            {
            "success": true,
            "data": [
                {
                "id": "string",
                "eventId": "string",
                "status": "pending | reviewing | accepted | rejected",
                "event": {
                    "title": "string",
                    "startAt": "Date | null"
                },
                "applicantProfile": {
                    "name": "string | null"
                },
                "createdAt": "Date"
                }
            ]
            }
            Errors: Solo 401 si no hay sesión



    Errors:
    HTTP	code	Mensaje
    400	INPUT_PARSE_ERROR	"No puedes postular a tu propio evento"
    400	VALIDATION_ERROR	"eventId es requerido" / "Cada URL debe ser válida" / "Máximo 10 URLs"
    404	NOT_FOUND	"Evento no encontrado" / "Perfil del postulante no encontrado"
    409	APPLICATION_ALREADY_EXISTS	"Ya existe una postulación activa para este evento."
    401	UNAUTHENTICATED	(sin sesión)


    Estructura deseada
    METODO DE LA PETICION(GET-POST-PUT-DELETE-) /"endpoint para obtener el recurso"
    REQUIRE-AUTH : BOOLEAN
    
    success 200 
    {
        estructura del endpoint en caso de exito    
    }

    { si es de tipo POST O PUT indicar la estructura del input deseada}

    error {mapear estructura de posibles errores y la estructura que refleja el backend }

#  4. Reglas de dominio

    - todas las reglas de negocio de los endpoints, por ejemplo que el perfil de usuario debe ser el mismo al del dueño del evento para hacer confguraciones al evento, etc
    - No podés aplicar a tu propio evento (profile.userId === event.profileId)
    - No podés aplicar dos veces al mismo evento
    - Solo el postulante o el dueño del evento pueden ver la aplicación
    - Se crea automáticamente una notificación in-app + email para el propietario cuando entra una postulacion
    - se genera una notificación al usuario cuando se modifica el estado de su publicacion(email + app)
    - Solo el postulante o el dueño del evento pueden ver los mensajes
    - La aplicación debe tener status: "accepted"
    - El array viene vacío al principio → normal
    

#   3. reglas de frontend state

        Debes presentar un multistep form que el state(y el contenido presentando en la screen dependa del state de la application - GET /api/mis-aplicaciones )
        siempre utilizar framer para animaciones smooth
        react-hook-form para los estados
        llamado al api siempre con error objects y loading state para dar feedback al usuario
        recuerda siempre tipar 


#   4. validation rules - zod

        Los fields desplegados no pueden ser null ninguno, debes poder mapear los 17 posibles fields en un esquema dentro de la ruta donde validez que los datos numericos no pueden ser 0 , booleanso siemrpe con valor y lo que se especifica arriba
        Siempre genera reglas de zod en base a las reglas de dominio para que no lleguen al backend, si no es posible, no, solo auqellas necesarias y posibles

#   5. UI constraints

        Siempre mobile first
        utilización de estilos de la app consistentes
        

# Skill references

    react-clean-architecture -> .atl/skill-registry

