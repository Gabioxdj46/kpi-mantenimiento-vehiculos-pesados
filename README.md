# 📊 Sistema Web de KPIs de Mantenimiento - Vehículos Pesados
Bienvenidos! Este es un proyecto que consiste en una aplicación web interactiva desarrolada con IA, que automatiza el control de indicadores clave (KPIs) de mantenimiento vehicular de los tres ultimos meses de 2025,  para una flota de vehículos pesados, tomando como base un modelo analítico creado y estructurado en **Microsoft Excel**.

---

## 🚀 ACCESO DIRECTO AL PROGRAMA WEB DE GESTION DE CONTROL DE MANTENIMIENTOS PARA UNA FLOTA DE VEHICULOS PESADOS
Para probar la aplicación web funcionando en tiempo real, haga clic en el siguiente enlace azul:

👉 **[CLIC AQUÍ PARA EJECUTAR LA APLICACIÓN WEB EN VIVO](https://script.google.com/macros/s/AKfycbw1zTRoGDpPcCj1uWvN3VHkW41jpBX-awLgMLDQrAAr9AvM_vGv4nhGDMwZmi2sGCgk7g/exec)**

---

## 🔑 CREDENCIALES DE ACCESO PARA EVALUACIÓN:
El sistema cuenta con un control de seguridad por roles. Para ingresar con el rol de **Observador** y auditar los gráficos interactivos, por favor utilice los siguientes datos en la pantalla de inicio de sesión:

*   **Usuario:** `obs`
*   **Contraseña:** `ort2025`

*(Nota: La base de datos y la sección de ingreso de datos se mantiene protegida bajo el rol de Administrador).*

---
## 📝 Contexto del Proyecto
La gestión de flotas de vehículos pesados, exige un control riguroso en las variables operativas para mitigar tiempos muertos, e imprevistos por danios, asi coomo la optimizacion en los costos logísticos. Tradicionalmente, los registros o datos de los vehiculos se manejaban de forma individual, limitando la visibilidad en tiempo real de los activos.

Este proyecto nace para resolver la necesidad del departamento de mecánica de centralizar y automatizar los datos en un entorno Cloud. Se diseñó un modelo maestro en **Microsoft Excel** enfocado en el registro detallado de fechas y tiempos de duracion de los mantenimientos preventivos y correctivos, kilometrajes recorridos y volumen de combustible cargado (galones de diésel). A partir de esta base de datos, se migró la estructura analítica hacia una **Aplicación Web interactiva en Google Apps Script**, la cual procesa la data y la calcula mensualmente los Indicadores Clave de Rendimiento (KPIs) exigidos por la alta gerencia para la toma de decisiones estratégicas.

---
### Pestaña 1: Dashboard Ejecutivo de KPIs Individuales y Comparativos
Constituye el núcleo visual de la aplicación. Mediante filtros interactivos de **Año, Mes, Proyecto y Placa / Código**, el sistema procesa instantáneamente la base de datos para desplegar métricas individuales del vehículo seleccionado y gráficos comparativos de barras temporales (Enero a Diciembre):
*   **Métricas del Periodo y Acumulados Anuales:** Despliega los Kilómetros recorridos totales, cantidad de Galones de diésel consumidos y la tasa de rendimiento energético ($Km/Gal$).
*   **Control de Órdenes de Trabajo:** Reporta cuantitativamente la cantidad de Mantenimientos Preventivos y Correctivos ejecutados en el mes evaluado.
*   **Gráficas de Distribución Mensual:** Dos paneles gráficos dinámicos que muestran la tendencia mensual de kilómetros recorridos y galones cargados para auditoría de desviaciones en el consumo de combustible.
*   **Disponibilidad Operativa del Vehiculo.

<img width="1903" height="708" alt="Captura de pantalla 2026-05-31 a la(s) 20 11 44" src="https://github.com/user-attachments/assets/be583a53-68b2-4b48-baf9-a47c45035fa3" />

### Pestaña 2: Reporte General Integrado (Tablas de KPIs Mensuales)
Módulo diseñado para la visualizacion macro de todos los datos de toda la flota, el cual integra todos los **20 vehículos registrados** de forma simultánea. Genera una matriz cruzada indexada por la Placa del vehículo y su Tipo (VACUUM, ARTICULADO, RIGIDO, CAMIONETA), desglosando los kilómetros recorridos mes a mes (Ene - Dic), Cantidad de galones cargados, Kilometros recorridos por galon, Numero de mantenimientos preventivos y correctivos y Kilometros recooridos por mantenimiento, calculando automáticamente el consolidado total anual por vehiculo para reportes de utilización de flota requeridos por la gerencia.

<img width="1893" height="843" alt="Captura de pantalla 2026-05-31 a la(s) 20 50 21" src="https://github.com/user-attachments/assets/cb3410df-8f76-4768-960b-425a2c326c48" />


### 🚦 Pestaña 3:Sistema Visual de Alertas de Mantenimiento
El algoritmo calcula de forma dinámica el kilometraje remanente antes del próximo servicio preventivo. Mediante el uso de una interfaz semáforo (alertas visuales de colores), el sistema reporta el estado crítico de cada vehículo pesado:
*   🟢 **Verde:** Activo en condición óptima de operación.
*   🟡 **Amarillo:** Alerta preventiva por proximidad al límite de kilometraje establecido para revisión.
*   🔴 **Rojo:** Parada obligatoria. Vehículo ha superado el rango crítico y requiere ingreso inmediato al taller.

<img width="1902" height="843" alt="Captura de pantalla 2026-05-31 a la(s) 20 13 07" src="https://github.com/user-attachments/assets/86319b6e-f922-43ad-9ecf-bc20d868de73" />


### 📊 Modelado Matemático de KPIs Mensuales
El backend del programa procesa las variables de kilometraje, tiempo de reparación y galones de diésel cargados para calcular de forma matemática y mensual las siguientes métricas en el Dashboard corporativo:

*   **Disponibilidad Mecánica del Vehículo ($D_m$):** Mide el porcentaje de tiempo real en el que la flota estuvo apta para operar frente al tiempo total planificado.
    $$D_m = \left( \frac{\text{Horas Totales de Operación} - \text{Horas de Parada por Taller}}{\text{Horas Totales de Operación}} \right) \times 100\%$$

*   **Rendimiento de Combustible:** Cálculo exacto de kilómetros recorridos por galón de diésel cargado ($Km/Gal$), permitiendo auditar la eficiencia energética del motor por cada vehículo pesado.

*   **Kilómetros por Mantenimiento:** Relación analítica que mide el desgaste del activo evaluando la cantidad de kilómetros acumulados entre cada intervención técnica.

*   **Mantenimientos Preventivos vs. Correctivos:** Monitoreo del volumen mensual de órdenes de trabajo ejecutadas de forma planificada frente a las fallas mecánicas de emergencia.

*   **MTBF (Mean Time Between Failures / Tiempo Medio Entre Fallas):** Indicador clave de confiabilidad que calcula el tiempo operativo promedio que transcurre entre una avería y otra.
    $$MTBF = \frac{\text{Tiempo Total de Operación}}{\text{Número de Fallas Correctivas}}$$

*   **MTTR (Mean Time To Repair / Tiempo Medio de Reparación):** Indicador de mantenibilidad que mide la eficiencia del equipo mecánico, calculando el tiempo promedio que se tarda en resolver y reparar un vehículo pesado una vez ingresado al taller.
    $$MTTR = \frac{\text{Tiempo Total de Reparación}}{\text{Número de Fallas Correctivas}}$$

---

## 🏁 4. Conclusiones Principales
1.  **Reducción de costos por dano en el vehiculo:** El panel del semáforo preventivo de *Motor y Caja de Transmisión* mitiga drásticamente la ocurrencia de mantenimientos correctivos de emergencia, reduciendo los costos asociados a vehículos pesados varados en el camino.
2.  **Incremento de la Confiabilidad Mecánica:** La centralización de las métricas de MTTR y MTBF permite a la gerencia identificar desviaciones en los tiempos de respuesta del taller y detectar "vehículos crónicos" cuyos costos de reparación superan su rentabilidad operativa.
3.  **Auditoría de Eficiencia Energética:** La correlación que existe entre los kilómetros totales recorridos y la curva mensual de la cantidad de galones de diésel consumidos, actúa como un filtro de control interno para detectar anomalías mecánicas (pérdidas de compresión, problemas de inyección) o desvíos injustificados de combustible.

---

## 📂 COMPONENTES DEL REPOSITORIO (ARCHIVOS ADJUNTOS)
En este mismo espacio de GitHub, ustedes podrá revisar de forma transparente los archivos que dan vida al proyecto:

1.  **`KPI_Mantenimiento_Vehiculos_Pesados.xlsx`**: Archivo maestro de Excel que sirve como la base de datos de origen y donde se modelaron las métricas de mantenimiento preliminares.
2.  **`code.gs`**: Código backend en JavaScript (Google Apps Script) que procesa las reglas de negocio, valida los roles de usuario y sirve los datos en la nube.
3.  **`index.html`**, `styles.html` y `javascript.html`: Archivos de la interfaz gráfica que construyen el Dashboard visual y ejecutan las funciones del lado del cliente.

---
**Desarrollado por:** Darío Gabriel Tacuri Guevara | Estudiante de Análisis de Datos
