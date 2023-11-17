## Refinanciamientos y pago sostenidos
Aplicación para recibir webhooks desde Mambu en los eventos de refinanciamientos y pagos a cuentas de préstamos que permite lo siguiente:

1. Para el evento de refinanciamiento (diagrama https://swimlanes.io/u/MWAfpHJFs): 
    - Validar la información del préstamo original y del refinanciado usando la API de Loans (https://api.mambu.com/#loan-accounts-getbyid)
    - Calcular la cantidad de días de atraso que tenía el préstamo original para asignarlo a un CF del préstamo nuevo.
    - Actualizar el préstamo nuevo con la nueva sucursal, días de atraso del préstamo original e inicializar el contador de pagos sostenidos como un CF a través de la API de Loans (https://api.mambu.com/#loan-accounts-patch).
    - Realiza el desembolso del nuevo préstamo refinanciado mediante la API de Loans Transactions (https://api.mambu.com/#loan-transactions-makedisbursement).

2. Para el evento de pago (diagrama https://app.diagrams.net/#G1hrLrEzkmLd7K1A42WVpSOzoJ0Dq7KsQH):
    - Determina si es un pago al día, mediante la validación del atributo arrears position/situación de pagos atrasados del pago.
    - Actualizar el CF contador de pagos sostenidos y cambiar la sucursal del préstamo si se alcanzó la cantidad de pagos sostenidos, a a través de la API de Loans (https://api.mambu.com/#loan-accounts-patch).


## Requisitos mínimos
1. Se deben tener configurados los campos personalizados a nivel de Branch y Loan Accounts descritos en el documento https://docs.google.com/document/d/1ms_1qk897VkY2nv4rVuYLQpCnW0OKtCjaXR-t28dd0Q/edit.
2. Se deben tener configuradas las plantillas de webhook en el tenant de Mambu descritos en el documento https://docs.google.com/document/d/1ms_1qk897VkY2nv4rVuYLQpCnW0OKtCjaXR-t28dd0Q/edit.


## Limitaciones conocidas
1. No se tiene implementado un esquema completo para el manejo de errores.
2. No se tiene implementado el uso de idempotencia.
3. No se tiene implementado un esquema de reintentos en caso de errores.
4. No se tiene implementado ningún esquema de seguridad para validar peticiones entrantes.
5. No se implementó el uso de autenticación básica para las llamadas API de Mambu, solo trabaja con apikeys. 

**Nota**: El código no está listo para producción, por lo que antes de intentar usarlo en un entorno productivo, pruébelo minuciosamente.


## Como ejecutar el programa:
1. Descargar el código.

2. Instalar nodejs.
   >https://nodejs.org/

3. Instalar los paquetes y modulos requeridos por la aplicación.
   >npm -install
    
4. Modificar el archivo .env con las configuraciones del ambiente requeridas.     
    - MAMBU_URL= https://demo.sandbox.mambu.com/api 
    >Instancia de Mambu

    - MAMBU_APIKEY=abcdefghjk12345546
    >API Key valida de la instancia de un consumer con los permisos necesarios para consultar y editar loans y CFs.

    - MAX_PAYMENTS=3
    >Parámetro para controlar el valor maximo de pagos sostenidos antes de realizar el cambio de etapa del préstamo.    

    - PORT=3000
    >Puerto en el que se levanta el servidor de nodejs para recibir los webhooks desde Mambu

5. Ejecutar el programa.
    >npm run start

6. Generar los eventos de refinanciamiento y pagos desde Mambu para disparar los procesos. Es importante que los campos personalizados necesarios esten configurados en el tenant.
    - Ejemplo para disparar el proceso de refinanciamiento a través de curl:
    >curl -X POST -H "Content-Type: application/json" -d '{"datetime": "2023-11-16 01:01:53","accountid": "SNSN314","nextbranchkey": "8a44a7748952f662018954f864257c07"}' http://localhost:3000/refinance

    - Ejemplo para disparar el proceso de pago sostenido a través de curl:
    >curl -X POST -H "Content-Type: application/json" -d '{"datetime": "2023-11-16 01:18:28","accountid": "IWTT427","paycounter": "3","initialbranchkey": "8a444935853413e00185354701e43f79"}' http://localhost:3000/payment


############################################################################################################################################################################################################################
## Refinancing and sustained payments
Application to receive webhooks from Mambu in refinancing events and payments to loan accounts that allows the following:

1. For the refinancing event (sequence diagram https://swimlanes.io/u/MWAfpHJFs): 
    - Validate original and refinanced loan information using the Loans API (https://api.mambu.com/#loan-accounts-getbyid)
    - Calculate the number of days late that the original loan was, to assign it to a CF of the new loan.
    - Update the new loan with the new branch, days late of the original loan and initialize the sustained payment counter as a CF through the Loans API (https://api.mambu.com/#loan-accounts-patch).
    - Disburse the new refinanced loan using the Loans Transactions API (https://api.mambu.com/#loan-transactions-makedisbursement).

2. For the payment event (sequence diagram https://app.diagrams.net/#G1hrLrEzkmLd7K1A42WVpSOzoJ0Dq7KsQH):
    - Determines if it is an up-to-date payment, by validating the arrears position attribute of the payment itself.
    - Update the CF sustained payment counter and change the loan branch if the amount of sustained payments was reached, through the Loans API (https://api.mambu.com/#loan-accounts-patch).


## Minimum requirements
1. The custom fields must be configured at the Branch and Loan Accounts level described in the document https://docs.google.com/document/d/1ms_1qk897VkY2nv4rVuYLQpCnW0OKtCjaXR-t28dd0Q/edit.
2. The webhook templates described in the document must be configured in the Mambu tenant https://docs.google.com/document/d/1ms_1qk897VkY2nv4rVuYLQpCnW0OKtCjaXR-t28dd0Q/edit.


## Known limitations
1. There is no complete error handling scheme implemented.
2. The use of idempotency has not been implemented.
3. There is no retry scheme implemented in case of errors.
4. There is no security scheme implemented to validate incoming requests.
5. Using basic authentication for Mambu API calls has not been implemented, it only works with apikeys.

**Note**: The code isn't Production Ready, so before trying to use it in a production environment, please test it thoroughly


## How to run the program:
1. Download the code.

2. Install nodejs.
   >https://nodejs.org/

3. Install the packages and modules required by the application.
   >npm -install
    
4. Modify the .env file with the required environment configurations.    
    - MAMBU_URL= https://demo.sandbox.mambu.com/api 
    >Mambu tenant

    - MAMBU_APIKEY=abcdefghjk12345546
    >Valid API Key linked to consumer of the tenant with the necessary permissions to query and edit loans and CFs.

    - MAX_PAYMENTS=3
    >Parameter to control the maximum value of sustained payments before changing the loan stage.

    - PORT=3000
    >Using basic authentication for Mambu API calls has not been implemented, it only works with apikeys.

5. Ejecutar el programa.
    >npm run start

6. Generate refinancing and payment events from Mambu to trigger the processes. It is important that the necessary custom fields are configured in the tenant.
    - Example to trigger the refinancing process through curl:
    >curl -X POST -H "Content-Type: application/json" -d '{"datetime": "2023-11-16 01:01:53","accountid": "SNSN314","nextbranchkey": "8a44a7748952f662018954f864257c07"}' http://localhost:3000/refinance

    - Example to trigger the sustained payment process through curl:
    >curl -X POST -H "Content-Type: application/json" -d '{"datetime": "2023-11-16 01:18:28","accountid": "IWTT427","paycounter": "0","initialbranchkey": "8a444935853413e00185354701e43f79"}' http://localhost:3000/payment