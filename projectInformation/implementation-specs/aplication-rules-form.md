# 1. Contexto de la screen

    Esta screen tiene como finalidad representar el proceso de crear reglas para un evento.
    El usuario podra seleccionar reglas y asignarles un puntaje,luego se guardaran asociadas al  evento.

# 2. ENTIDADES DE DOMINIO AFECTADAS

    Crea / Modifica
        Entidad	Descripción	Relación
        ScoringRule	Regla de scoring que asocia un ruleType + weight a un evento	Pertenecen a un Event

    Lee (solo lectura)
        Entidad	Descripción	Uso en la screen
        Event	Evento al que se le configuran las reglas	Verificar propiedad (eventId)
        Region	Catálogo de regiones disponibles	Carga del catálogo de reglas (via GET /api/scoring-rules/catalog)
    Location	Ubicaciones asociadas a cada r	Resolución de regionId para la regla SAME_REGION

# 3. API contraints(GET structure - POST STRUCTURE)

        Obtener catálogo de reglas
            GET /api/scoring-rules/catalog
                Permite obtener el catálogo de reglas disponibles para configurar en un evento.
                El frontend mapea ruleType a un string friendly para mostrar en UI.
                AUTH-None - No se requiere token
                {
                "success": true,
                "data": [
                    { "ruleType": "VERIFIED_PROFILE", "description": "La empresa completó el proceso de verificación empresarial", "group": "perfil" },
                    { "ruleType": "SAME_REGION", "description": "La empresa pertenece a la misma región del evento", "group": "ubicacion" }
                ]
                }

        GET /api/events/:eventId/scoring-rules
            permite obtener las reglas asociadas a un evento en particular
            AUTH-PROPIETARIO_DEL_EVENTO - Solo el propietario del evento
            {
                "success": true,
                "data": [
                    { "id": "rule_abc", "eventId": "evt_xyz", "ruleType": "VERIFIED_PROFILE", "weight": 10, "config": null, "createdAt": "2026-07-11T..." }
                ]
            }

        GET /api/regiones
            pemite obtener el listado de regiones de la app. en al feature permite precargar los valores en el dropdown.
            {
                "success": true,
                "data": [
                    {
                    "id": "reg_001",
                    "name": "Región Metropolitana",
                    "slug": "region-metropolitana",
                    "locations": [
                        { "id": "loc_001", "name": "Santiago", "slug": "santiago" }
                    ]
                    }
                ]
            }

    Obtener reglas configuradas para un evento
        GET /api/events/:eventId/scoring-rules
            Permite obtener las reglas que el propietario del evento configuró para ese evento específico.
            AUTH-PROPIETARIO_DEL_EVENTO — Solo el propietario del evento
            Path params:
                eventId
            Response 200:
        {
        "success": true,
        "data": [
            {
            "id": "rule_abc",
            "eventId": "evt_xyz",
            "ruleType": "VERIFIED_PROFILE",
            "weight": 10,
            "config": null,
            "createdAt": "2026-07-11T12:00:00.000Z"
            }
        ]
        }
        Response 404 (evento no existe):
        {
        "success": false,
        "error": { "code": "NOT_FOUND", "message": "Evento no encontrado" }
        }
        Response 403 (no es propietario):
        {
        "success": false,
        "error": { "code": "FORBIDDEN", "message": "No tienes permiso para ver las reglas de este evento" }
        }

        CREAR REGLAS PARA UN EVENTO
            POST /api/events/:eventId/scoring-rules
            Permite al propietario del evento configurar las reglas de scoring que se usarán para evaluar las postulaciones. Reemplaza todas las reglas existentes (delete + insert).
            Auth: PROPIETARIO_DEL_EVENTO — Solo el propietario del evento
            Path params:
            Param
            eventId
            Request body:
            {
            "rules": [
                { "ruleType": "VERIFIED_PROFILE", "weight": 10 },
                { "ruleType": "SAME_REGION", "weight": 5 },
                { "ruleType": "HAS_PORTFOLIO", "weight": 8, "config": null }
            ]
            }
            Campo
            rules
            rules[].ruleType
            rules[].weight
            rules[].config
            Response 200:
            {
            "success": true,
            "data": [
                {
                "id": "rule_abc",
                "eventId": "evt_xyz",
                "ruleType": "VERIFIED_PROFILE",
                "weight": 10,
                "config": null,
                "createdAt": "2026-07-11T12:00:00.000Z"
                }
            ]
            }
            Response 400 (reglas vacías):
            {
            "success": false,
            "error": { "code": "SCORING_RULES_EMPTY", "message": "Debe proporcionar al menos una regla" }
            }
            Response 404 (evento no existe):
            {
            "success": false,
            "error": { "code": "NOT_FOUND", "message": "Evento no encontrado" }
            }
            Response 403 (no es propietario):
            {
            "success": false,
            "error": { "code": "FORBIDDEN", "message": "No tienes permiso para modificar las reglas de este evento" }
            }

    ## UBICACION

        GET /api/regiones
            Retorna el listado de regiones del sistema. Se usa para el dropdown de ubicación del evento.
            AUTH-None - No se requiere token

            success - 200
            {
                "success": true,
                "data": [
                    {
                    "id": "reg_001",
                    "name": "Región Metropolitana",
                    "slug": "region-metropolitana",
                    "locations": [
                        { "id": "loc_001", "name": "Santiago", "slug": "santiago" },
                        { "id": "loc_002", "name": "Puente Alto", "slug": "puente-alto" }
                    ]
                    }
                ]
        }

    # RULES

       	GRUPO 	RULE_TYPE
        perfil	VERIFIED_PROFILE, HAS_PORTFOLIO, YEARS_EXPERIENCE, HAS_WEBSITE, HAS_SOCIAL_LINKS, HAS_COMPANY_DESCRIPTION, HAS_LOGO, HAS_BANNER
        ubicacion	SAME_REGION
        historial	HAS_PREVIOUS_FEEDBACK, AVERAGE_RATING, NUMBER_OF_COMPLETED_JOBS, NUMBER_OF_COMPLETED_EVENTS, HAS_RESPONSE_HISTORY, FAST_RESPONSE_TIME
        premium	IS_PREMIUM_COMPANY
        custom	CUSTOM_FIELD_MATCH

        as RULE_TYPE

# 3. reglas de frontend state

        Existe una funcion que mapea el "ruleTYPE" hacia un friendly message
        esta funcion esta ubicada en /lib/domain/rules/functions

        export const RULE_LABELS: Record<RuleType, string> = {
            PROFILE_VERIFIED: "Perfil verificado",
            EMAIL_VERIFIED: "Correo verificado",
            PHONE_VERIFIED: "Teléfono verificado",
        };

# 4. validation rules - zod

        - Al submitearel form que crea reglas para la publciacion/evento, debe existir una valdiacion de que debe haber por lo menos 1 regla creada
        - Los puntos de cada regla deben ser un valor numerico positivo - weight
        - los puntos van del 1 al 100

# 5. UI constraints

    -
