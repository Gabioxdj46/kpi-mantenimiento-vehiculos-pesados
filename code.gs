/**
 * Sistema web de control de flota vehicular.
 * Backend para Google Apps Script + Google Sheets.
 */

const APP_CONFIG = {
  appName: 'Control de Flota Vehicular',
  defaultProject: 'ENAP',
  monthNames: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  monthOptions: [
    { value: '', label: 'Todo el año' },
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ],
  fixedYears: [2025, 2026, 2027, 2028, 2029, 2030],
  projectOptions: ['Auca', 'Petroecuador', 'SHAYA', 'ENAP', 'BASE ORT', 'PCR'],
  sheetNames: {
    fleet: 'Flota Vehicular',
    routes: 'Rutas',
    maintenance: 'Mantenimiento',
    workshops: 'Talleres',
    lists: 'Otras listas',
    generalReport: 'Reporte General'
  }
};

const SCHEMAS = {
  fleet: {
    sheetName: 'Flota Vehicular',
    minMatches: 4,
    fields: {
      number: ['Nro', 'Item'],
      project: ['Proyecto', 'Contrato', 'STATUS', 'Status'],
      plate: ['Placa Vehiculo', 'PLACA', 'Placa', 'Codigo Equipo', 'Código Equipo', 'Equipo'],
      type: ['TIPO', 'Tipo', 'Tipo Vehiculo', 'Tipo Vehículo'],
      brand: ['MARCA', 'Marca'],
      model: ['MODELO', 'Modelo'],
      motorSerial: ['Serie Motor', 'Numero de serie del motor', 'Número de serie del motor', 'NRO DE SERIE'],
      chassisSerial: ['Serie Chasis', 'Numero de serie del chasis', 'Número de serie del chasis'],
      year: ['AÑO', 'Ano', 'Año'],
      color: ['COLOR', 'Color'],
      status: ['Estado Vehiculo', 'Estado Vehículo', 'Estado'],
      motorCycleKm: ['Ciclo para Mnnto Prevent. Motor (Kms)', 'Ciclo para Mnnto Prevent.\nMotor\n (Kms)', 'Ciclo Mantenimiento Motor', 'Planilla Mant', 'PLANILLA/R MANT'],
      boxCycleKm: ['Ciclo para Mnnto Preventivo Caja y Diferencial', 'Ciclo para \nMnnto\nPreventivo\nCaja y Diferencial', 'Ciclo Mantenimiento Caja'],
      initialKm: ['Kms Odómetro Inicial', 'Km Inicial', 'Kms Inicial'],
      currentKm: ['Kms Odómetro Actual', 'KM ACTUAL', 'Km Actual'],
      missingKmMotor: ['Kms faltantes Mnnto Prev. Motor (Km)', 'ALERTA FALTA KM /H', 'Falta Km'],
      maintenanceStatus: ['Estado Mantenimiento Preventivo', 'STATUS', 'Status Mantenimiento']
    }
  },
  routes: {
    sheetName: 'Rutas',
    minMatches: 5,
    fields: {
      number: ['Nro', 'Item'],
      startDate: ['Fecha de Salida', 'Fecha de Inicio', 'Fecha Inicio'],
      endDate: ['Fecha de Llegada', 'Fecha de Fin', 'Fecha Fin'],
      plate: ['Placa Vehiculo', 'PLACA', 'Placa', 'Codigo Equipo', 'Código Equipo'],
      project: ['Proyecto', 'Contrato', 'Status'],
      status: ['Estado Vehículo', 'Estado Vehiculo'],
      driver: ['Conductor'],
      origin: ['Origen'],
      destination: ['Destino'],
      kmStart: ['Kms Inicial (Odómetro)', 'Km Inicial', 'Kms Inicial'],
      kmEnd: ['Kms Final (Odómetro)', 'Km Final', 'Kms Final', 'KM ACTUAL', 'Km Actual', 'Kilometraje Actual'],
      kms: ['Kms Recorridos', 'Km Recorridos', 'Total de Kms', 'Total Kms'],
      hours: ['Horas trabjadas', 'Horas trabajadas', 'Horas de operación', 'Horas Operacion'],
      gallons: ['Volumen de Combustible (gal)', 'Cantidad de galones', 'Galones Cargados', 'Galones'],
      kmPerGallon: ['Recorrido por und. de comb. (Km/gal)', 'Km/Gal', 'Kilometros sobre galon'],
      observations: ['Observaciones']
    }
  },
  maintenance: {
    sheetName: 'Mantenimiento',
    minMatches: 5,
    fields: {
      number: ['Nro', 'Item'],
      plate: ['Placa Vehiculo', 'PLACA', 'Placa', 'Codigo Equipo', 'Código Equipo'],
      project: ['Proyecto', 'Contrato', 'Status'],
      workshop: ['Taller', 'Mecanica', 'Mecánica'],
      entryDate: ['Fecha Entrada', 'Fecha Ingreso'],
      exitDate: ['Fecha Salida', 'Fecha de Salida'],
      type: ['Tipo', 'Tipo Mantenimiento'],
      odometer: ['Kilometraje del Odómetro', 'Kilometraje', 'Km Ingreso'],
      kmBetween: ['KM Entre MTO', 'KM Entre Mantenimiento', 'Kilometraje entre mantenimiento'],
      correctiveTime: ['Tiempo MTO CRTVO', 'Tiempo MTO Correctivo', 'Tiempo Correctivo'],
      preventiveTime: ['Tiempo MTO PTVO', 'Tiempo MTO Preventivo', 'Tiempo Preventivo'],
      package: ['Paquete de Mantenimiento', 'Servicio', 'Clasificacion', 'Clasificación'],
      orderNumber: ['N° de Orden', 'No de Orden', 'Numero de Orden', 'Número de Orden'],
      mechanic: ['Mecanico', 'Mecánico', 'Responsable'],
      cause: ['Causas del Mantenimiento', 'Causa', 'Observaciones'],
      cost: ['Costo Total ($)', 'Costo Total'],
      observations: ['Observaciones']
    }
  },
  workshops: {
    sheetName: 'Talleres',
    minMatches: 2,
    fields: {
      number: ['Nro'],
      name: ['Nombre del Taller', 'Taller', 'Mecanica', 'Mecánica'],
      address: ['Dirección', 'Direccion'],
      phone: ['Teléfono/Celular', 'Telefono/Celular', 'Telefono'],
      email: ['Correo'],
      contact: ['Contacto Principal', 'Contacto']
    }
  }
};

const WRITE_HEADERS = {
  fleet: ['Nro', 'Proyecto', 'Placa Vehiculo', 'Tipo', 'Marca', 'Modelo', 'Serie Motor', 'Serie Chasis', 'Año', 'Color', 'Ciclo Mantenimiento Motor', 'Ciclo Mantenimiento Caja', 'Estado'],
  routes: ['Nro', 'Fecha de Inicio', 'Fecha de Fin', 'Placa Vehiculo', 'Proyecto', 'Kms Inicial', 'Kms Final', 'Kms Recorridos', 'Horas trabajadas', 'Galones Cargados', 'Observaciones'],
  maintenance: ['Nro', 'Placa Vehiculo', 'Proyecto', 'Taller', 'Fecha Entrada', 'Fecha Salida', 'Tipo', 'Kilometraje del Odómetro', 'KM Entre MTO', 'Tiempo MTO CRTVO', 'Tiempo MTO PTVO', 'Paquete de Mantenimiento', 'N° de Orden', 'Mecánico', 'Causas del Mantenimiento', 'Costo Total ($)', 'Observaciones']
};

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle(APP_CONFIG.appName)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Flota Web')
    .addItem('Preparar hojas base', 'setupWorkbook')
    .addItem('Abrir Web App en dialogo', 'showSidebarApp')
    .addToUi();
}

function showSidebarApp() {
  const html = HtmlService.createTemplateFromFile('Index').evaluate().setTitle(APP_CONFIG.appName);
  SpreadsheetApp.getUi().showSidebar(html);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function setupWorkbook() {
  const ss = getSpreadsheet_();
  Object.keys(WRITE_HEADERS).forEach(function (key) {
    const name = SCHEMAS[key].sheetName;
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      sheet.getRange(1, 1, 1, WRITE_HEADERS[key].length).setValues([WRITE_HEADERS[key]]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, WRITE_HEADERS[key].length).setFontWeight('bold').setBackground('#0f5f7a').setFontColor('#ffffff');
    } else {
      syncWritableHeaders_(sheet, key);
    }
  });
  if (!ss.getSheetByName(APP_CONFIG.sheetNames.workshops)) {
    const sheet = ss.insertSheet(APP_CONFIG.sheetNames.workshops);
    const headers = ['Nro', 'Nombre del Taller', 'Dirección', 'Teléfono/Celular', 'Correo', 'Contacto Principal'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
  return { ok: true, message: 'Hojas base verificadas.' };
}

function syncWritableHeaders_(sheet, key) {
  const values = sheet.getDataRange().getValues();
  const header = findHeader_(values, SCHEMAS[key]);
  if (!header) return;
  const existing = values[header.rowIndex].map(normalize_);
  const missing = WRITE_HEADERS[key].filter(function (name) {
    return existing.indexOf(normalize_(name)) < 0;
  });
  if (!missing.length) return;
  const startCol = sheet.getLastColumn() + 1;
  sheet.getRange(header.rowIndex + 1, startCol, 1, missing.length).setValues([missing]);
  sheet.getRange(header.rowIndex + 1, startCol, 1, missing.length).setFontWeight('bold').setBackground('#0f5f7a').setFontColor('#ffffff');
}

function getBootstrapData() {
  const fleet = getFleetRecords_();
  const routeYears = getYearsFromRecords_(getRecords_('routes'), ['startDate', 'endDate']);
  const maintenanceYears = getYearsFromRecords_(getRecords_('maintenance'), ['entryDate', 'exitDate']);
  const currentYear = new Date().getFullYear();
  const years = unique_(APP_CONFIG.fixedYears.concat([currentYear], routeYears, maintenanceYears)).sort();
  const projects = unique_(APP_CONFIG.projectOptions.concat(fleet.map(function (v) { return v.project; }).filter(Boolean))).sort();
  const vehicles = fleet.map(publicVehicle_);
  const workshops = getRecords_('workshops').map(function (w) { return w.name; }).filter(Boolean).sort();

  return {
    config: APP_CONFIG,
    years: years,
    projects: projects,
    vehicles: vehicles,
    types: unique_(vehicles.map(function (v) { return v.type; }).filter(Boolean)).sort(),
    brands: unique_(vehicles.map(function (v) { return v.brand; }).filter(Boolean)).sort(),
    workshops: workshops,
    maintenanceTypes: ['Preventivo', 'Correctivo', 'Prev Caja y Corona'],
    preventivePackages: ['Preventivo 01 25000 km', 'Preventivo 02 50000 km', 'Preventivo 03 75000 km', 'Preventivo 04 100000 km'],
    correctivePackages: ['Mecanico', 'Electrico', 'Pintura', 'Llantas']
  };
}

function getDashboardData(filters) {
  filters = normalizeFilters_(filters);
  const fleet = filterVehicles_(getFleetRecords_(), filters);
  const stats = buildStats_(filters, fleet);
  const selectedPlate = filters.plate || (fleet[0] && fleet[0].plate) || '';
  const selectedVehicle = fleet.find(function (v) { return equals_(v.plate, selectedPlate); }) || fleet[0] || {};
  const metric = vehicleMetric_(selectedVehicle, fleet);
  const monthly = selectedVehicle.plate ? stats.byPlate[selectedVehicle.plate] || emptyMonthlyStats_() : stats.total;
  const selectedSummary = summarizeSelectedPeriod_(monthly, filters, metric);
  const kpiRows = KPI_DEFINITIONS_(metric).map(function (def) {
    const values = monthly.months.map(function (m) { return round_(def.value(m), def.decimals || 0); });
    return {
      key: def.key,
      label: def.label,
      unit: def.unit,
      values: values,
      total: round_(def.total(monthly), def.decimals || 0)
    };
  });

  return {
    filters: filters,
    vehicle: publicVehicle_(selectedVehicle),
    metric: metric,
    periodLabel: filters.month ? APP_CONFIG.monthOptions[filters.month].label + ' ' + filters.year : 'Año ' + filters.year,
    summary: selectedSummary,
    yearSummary: summarizeMonthly_(monthly, metric),
    monthlyKpis: kpiRows,
    chartSeries: chartSeriesFromMonthly_(monthly, filters, expectedMaintenanceCycle_(selectedVehicle, fleet), metric),
    fleetSummary: summarizeMonthly_(stats.total, metric),
    ranking: buildRanking_(stats.byPlate, fleet),
    alerts: buildAlerts_(fleet, stats.byPlate).slice(0, 12),
    status: buildStatusBreakdown_(fleet, stats.byPlate)
  };
}

function getGeneralReportData(filters) {
  filters = normalizeFilters_(filters);
  const reportFilters = {
    year: filters.year,
    month: 0,
    project: filters.project,
    plate: '',
    type: '',
    brand: ''
  };
  const fleet = filterVehicles_(getFleetRecords_(), reportFilters);
  const stats = buildStats_(reportFilters, fleet);
  const metricDefs = [
    { key: 'kms', label: 'Km recorridos mensuales', unit: 'km', value: function (m) { return m.kms; }, decimals: 0 },
    { key: 'gallons', label: 'Galones cargados por vehículo', unit: 'gal', value: function (m) { return m.gallons; }, decimals: 2 },
    { key: 'kmPerGallon', label: 'Kilómetros recorridos sobre galón', unit: 'km/gal', value: function (m) { return safeDiv_(m.kms, m.gallons); }, decimals: 2 },
    { key: 'preventive', label: 'Mantenimientos preventivos', unit: 'und', value: function (m) { return m.preventive; }, decimals: 0 },
    { key: 'corrective', label: 'Mantenimientos correctivos', unit: 'und', value: function (m) { return m.corrective; }, decimals: 0 },
    { key: 'kmPerPreventive', label: 'Kilómetros recorridos por mantenimiento preventivo', unit: 'km/mto prev', value: function (m) { return safeDiv_(m.kms, m.preventive); }, decimals: 0 }
  ];

  const tables = metricDefs.map(function (metric) {
    return {
      key: metric.key,
      title: metric.label,
      unit: metric.unit,
      rows: fleet.map(function (vehicle) {
        const monthly = stats.byPlate[vehicle.plate] || emptyMonthlyStats_();
        const values = monthly.months.map(function (m) { return round_(metric.value(m), metric.decimals); });
        return {
          plate: vehicle.plate,
          type: vehicle.type,
          brand: vehicle.brand,
          values: values,
          total: round_(values.reduce(function (a, b) { return a + Number(b || 0); }, 0), metric.decimals)
        };
      })
    };
  });

  return {
    filters: reportFilters,
    months: APP_CONFIG.monthNames,
    tables: tables,
    ranking: buildRanking_(stats.byPlate, fleet),
    totals: summarizeMonthly_(stats.total)
  };
}

function getAlertsData(filters) {
  filters = normalizeFilters_(filters);
  const alertFilters = {
    year: filters.year,
    month: 0,
    project: filters.project,
    plate: '',
    type: '',
    brand: ''
  };
  const fleet = filterVehicles_(getFleetRecords_(), alertFilters);
  return {
    filters: alertFilters,
    alerts: buildAlerts_(fleet),
    generatedAt: new Date().toISOString()
  };
}

function getTableData(payload) {
  payload = payload || {};
  const key = payload.key || 'routes';
  const filters = normalizeFilters_(payload.filters || {});
  const records = getRecords_(key);
  const fleetByPlate = indexBy_(getFleetRecords_(), 'plate');
  const rows = records.filter(function (record) {
    const plate = asText_(record.plate);
    const vehicle = fleetByPlate[plate] || {};
    const project = record.project || vehicle.project || APP_CONFIG.defaultProject;
    if (filters.project && !equals_(project, filters.project)) return false;
    if (filters.plate && !equals_(plate, filters.plate)) return false;
    const filterDate = key === 'maintenance'
      ? (toDate_(record.entryDate) || toDate_(record.exitDate))
      : (toDate_(record.endDate) || toDate_(record.startDate));
    if (filters.year && filterDate && filterDate.getFullYear() !== Number(filters.year)) return false;
    if (filters.month && filterDate && filterDate.getMonth() + 1 !== Number(filters.month)) return false;
    return true;
  }).slice(-250).reverse();
  return { key: key, rows: rows.map(publicRecord_) };
}

function saveVehicle(row) {
  row = row || {};
  row.plate = asPlate_(row.plate);
  if (!row.plate) throw new Error('Debes indicar la placa o codigo del vehiculo.');
  if (fleetPlateExists_(row.plate)) throw new Error('Vehiculo ya ingresado: ' + row.plate + '. No se puede registrar dos veces la misma placa o codigo.');
  row.project = row.project || APP_CONFIG.defaultProject;
  applyVehicleCycleDefaults_(row);
  return appendCanonicalRow_('fleet', row);
}

function updateVehicleProject(payload) {
  payload = payload || {};
  const plate = asPlate_(payload.plate);
  const project = asText_(payload.project);
  if (!plate) throw new Error('Debes indicar la placa o codigo del vehiculo.');
  if (!project) throw new Error('Debes indicar el proyecto.');

  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(SCHEMAS.fleet.sheetName);
  if (!sheet) throw new Error('No existe la hoja Flota Vehicular.');

  syncWritableHeaders_(sheet, 'fleet');
  const values = sheet.getDataRange().getValues();
  const header = findHeader_(values, SCHEMAS.fleet);
  if (!header) throw new Error('No se encontro el encabezado de Flota Vehicular.');

  if (header.map.project === undefined) {
    syncWritableHeaders_(sheet, 'fleet');
    return updateVehicleProject(payload);
  }

  for (let r = header.rowIndex + 1; r < values.length; r++) {
    const currentPlate = asPlate_(values[r][header.map.plate]);
    if (currentPlate && equals_(currentPlate, plate)) {
      sheet.getRange(r + 1, header.map.project + 1).setValue(project);
      return { ok: true, plate: plate, project: project, row: r + 1 };
    }
  }

  throw new Error('No se encontro el vehiculo ' + plate + ' en Flota Vehicular.');
}

function updateVehicleProjects(payload) {
  payload = payload || {};
  const rows = payload.rows || payload.changes || [];
  if (!rows.length) return { ok: true, updated: 0 };

  const changes = {};
  rows.forEach(function (row) {
    const plate = asPlate_(row.plate);
    const project = asText_(row.project);
    if (plate && project) changes[plate] = project;
  });
  const plates = Object.keys(changes);
  if (!plates.length) throw new Error('No hay cambios de proyecto para guardar.');

  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(SCHEMAS.fleet.sheetName);
  if (!sheet) throw new Error('No existe la hoja Flota Vehicular.');

  syncWritableHeaders_(sheet, 'fleet');
  const values = sheet.getDataRange().getValues();
  const header = findHeader_(values, SCHEMAS.fleet);
  if (!header) throw new Error('No se encontro el encabezado de Flota Vehicular.');
  if (header.map.project === undefined || header.map.plate === undefined) {
    throw new Error('La hoja Flota Vehicular debe tener columnas de Placa y Proyecto.');
  }

  let updated = 0;
  for (let r = header.rowIndex + 1; r < values.length; r++) {
    const currentPlate = asPlate_(values[r][header.map.plate]);
    if (currentPlate && changes[currentPlate]) {
      sheet.getRange(r + 1, header.map.project + 1).setValue(changes[currentPlate]);
      updated++;
    }
  }

  return { ok: true, updated: updated, requested: plates.length };
}

function deduplicateFleetVehicles() {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(SCHEMAS.fleet.sheetName);
  if (!sheet) throw new Error('No existe la hoja Flota Vehicular.');
  const values = sheet.getDataRange().getValues();
  const header = findHeader_(values, SCHEMAS.fleet);
  if (!header || header.map.plate === undefined) throw new Error('No se encontro la columna de placa en Flota Vehicular.');

  const seen = {};
  const rowsToDelete = [];
  for (let r = values.length - 1; r > header.rowIndex; r--) {
    const plate = asPlate_(values[r][header.map.plate]);
    if (!plate) continue;
    if (seen[plate]) rowsToDelete.push(r + 1);
    else seen[plate] = true;
  }

  rowsToDelete.sort(function (a, b) { return b - a; }).forEach(function (rowNumber) {
    sheet.deleteRow(rowNumber);
  });
  renumberSheet_(sheet, 'fleet');
  return { ok: true, deleted: rowsToDelete.length, remaining: Object.keys(seen).length };
}

function deduplicateMaintenanceRecords() {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(SCHEMAS.maintenance.sheetName);
  if (!sheet) throw new Error('No existe la hoja Mantenimiento.');
  const values = sheet.getDataRange().getValues();
  const header = findHeader_(values, SCHEMAS.maintenance);
  if (!header || header.map.plate === undefined) throw new Error('No se encontro la columna de placa en Mantenimiento.');

  const seen = {};
  const rowsToDelete = [];
  for (let r = values.length - 1; r > header.rowIndex; r--) {
    const row = values[r];
    const key = maintenanceDuplicateKeyFromRow_(row, header.map);
    if (!key) continue;
    if (seen[key]) rowsToDelete.push(r + 1);
    else seen[key] = true;
  }

  rowsToDelete.sort(function (a, b) { return b - a; }).forEach(function (rowNumber) {
    sheet.deleteRow(rowNumber);
  });
  renumberSheet_(sheet, 'maintenance');
  return { ok: true, deleted: rowsToDelete.length, remaining: Object.keys(seen).length };
}

function deduplicateRouteRecords() {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(SCHEMAS.routes.sheetName);
  if (!sheet) throw new Error('No existe la hoja Rutas.');
  const values = sheet.getDataRange().getValues();
  const header = findHeader_(values, SCHEMAS.routes);
  if (!header || header.map.plate === undefined) throw new Error('No se encontro la columna de placa en Rutas.');

  const seen = {};
  const rowsToDelete = [];
  for (let r = values.length - 1; r > header.rowIndex; r--) {
    const row = values[r];
    const key = routeDuplicateKeyFromRow_(row, header.map);
    if (!key) continue;
    if (seen[key]) rowsToDelete.push(r + 1);
    else seen[key] = true;
  }

  rowsToDelete.sort(function (a, b) { return b - a; }).forEach(function (rowNumber) {
    sheet.deleteRow(rowNumber);
  });
  renumberSheet_(sheet, 'routes');
  return { ok: true, deleted: rowsToDelete.length, remaining: Object.keys(seen).length };
}

function deleteRouteRows(payload) {
  payload = payload || {};
  const rows = (payload.rows || []).map(function (row) { return Number(row); }).filter(function (row) { return row > 0; });
  if (!rows.length) return { ok: true, deleted: 0 };

  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(SCHEMAS.routes.sheetName);
  if (!sheet) throw new Error('No existe la hoja Rutas.');
  const values = sheet.getDataRange().getValues();
  const header = findHeader_(values, SCHEMAS.routes);
  if (!header) throw new Error('No se encontro el encabezado de Rutas.');

  const firstDataRow = header.rowIndex + 2;
  const lastRow = sheet.getLastRow();
  const uniqueRows = unique_(rows).filter(function (row) {
    return row >= firstDataRow && row <= lastRow;
  }).sort(function (a, b) { return b - a; });

  uniqueRows.forEach(function (rowNumber) { sheet.deleteRow(rowNumber); });
  renumberSheet_(sheet, 'routes');
  return { ok: true, deleted: uniqueRows.length };
}

function saveRoute(row) {
  row = row || {};
  prepareRouteRow_(row);
  return appendCanonicalRow_('routes', row);
}

function saveMaintenance(row) {
  row = row || {};
  const entry = toDate_(row.entryDate);
  const exit = toDate_(row.exitDate);
  const hours = entry && exit ? Math.max(0, (exit.getTime() - entry.getTime()) / 3600000) : 0;
  if (String(row.type || '').toLowerCase().indexOf('correct') >= 0 && !row.correctiveTime) row.correctiveTime = hours;
  if (String(row.type || '').toLowerCase().indexOf('prevent') >= 0 && !row.preventiveTime) row.preventiveTime = hours;
  return appendCanonicalRow_('maintenance', row);
}

function prepareRouteRow_(row) {
  row = row || {};
  row.plate = asPlate_(row.plate);
  row.kms = number_(row.kms) || Math.max(0, number_(row.kmEnd) - number_(row.kmStart));
  const vehicle = getFleetRecords_().find(function (v) { return equals_(v.plate, row.plate); }) || {};
  return prepareRouteForVehicle_(row, vehicle);
}

function prepareRouteForVehicle_(row, vehicle) {
  row = row || {};
  row.kms = number_(row.kms) || Math.max(0, number_(row.kmEnd) - number_(row.kmStart));
  row.hours = number_(row.hours);
  if (isHourBasedVehicle_(vehicle) && !row.hours) {
    row.hours = row.kms || Math.max(0, number_(row.kmEnd) - number_(row.kmStart));
  }
  return row;
}

function importRows(payload) {
  payload = payload || {};
  const key = payload.key;
  const rows = payload.rows || [];
  if (!WRITE_HEADERS[key]) throw new Error('Tipo de importación no soportado.');
  if (key === 'fleet') return importFleetRowsWithoutDuplicates_(rows);
  rows.forEach(function (row) {
    if (key === 'routes') prepareRouteRow_(row);
    appendCanonicalRow_(key, row);
  });
  return { ok: true, inserted: rows.length };
}

function importFromSpreadsheet(payload) {
  payload = payload || {};
  const key = payload.key;
  const sourceId = payload.spreadsheetId;
  const sourceSheetName = payload.sheetName;
  if (!WRITE_HEADERS[key]) throw new Error('Destino no soportado.');
  if (!sourceId) throw new Error('Debes indicar el ID del Google Sheet origen.');
  const source = SpreadsheetApp.openById(sourceId);
  const sheet = sourceSheetName ? source.getSheetByName(sourceSheetName) : source.getSheets()[0];
  if (!sheet) throw new Error('No se encontró la hoja origen.');
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return { ok: true, inserted: 0 };
  const header = values[0].map(asText_);
  const rows = values.slice(1).filter(function (r) { return r.some(function (v) { return v !== '' && v !== null; }); }).map(function (r) {
    const obj = {};
    header.forEach(function (h, i) { obj[h] = valueToJson_(r[i]); });
    return coerceImportedRow_(key, obj);
  });
  if (key === 'fleet') {
    const result = importFleetRowsWithoutDuplicates_(rows);
    result.sourceSheet = sheet.getName();
    return result;
  }
  rows.forEach(function (row) {
    if (key === 'routes') prepareRouteRow_(row);
    appendCanonicalRow_(key, row);
  });
  return { ok: true, inserted: rows.length, skipped: 0, sourceSheet: sheet.getName() };
}

function createExecutivePdf(filters) {
  const data = getDashboardData(filters);
  const html = buildExecutivePdfHtml_(data);
  const blob = Utilities.newBlob(html, 'text/html', 'informe-flota.html').getAs('application/pdf');
  blob.setName('Informe_Flota_' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmm') + '.pdf');
  const file = DriveApp.createFile(blob);
  return { ok: true, url: file.getUrl(), name: file.getName() };
}

function createAlertsPdf(filters) {
  const data = getAlertsData(filters);
  const html = buildAlertsPdfHtml_(data);
  const blob = Utilities.newBlob(html, 'text/html', 'alertas-mantenimiento.html').getAs('application/pdf');
  blob.setName('Alertas_Mantenimiento_' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmm') + '.pdf');
  const file = DriveApp.createFile(blob);
  return { ok: true, url: file.getUrl(), name: file.getName() };
}

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) throw new Error('Configura SPREADSHEET_ID en Propiedades del script o usa el proyecto enlazado al Sheet.');
  return active;
}

function getRecords_(schemaKey) {
  const schema = SCHEMAS[schemaKey];
  if (!schema) return [];
  const sheet = getSpreadsheet_().getSheetByName(schema.sheetName);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (!values.length) return [];
  const header = findHeader_(values, schema);
  if (!header) return [];
  return values.slice(header.rowIndex + 1).map(function (row, offset) {
    const obj = { _row: header.rowIndex + offset + 2 };
    Object.keys(header.map).forEach(function (field) {
      obj[field] = row[header.map[field]];
    });
    return normalizeRecord_(schemaKey, obj);
  }).filter(function (record) {
    return Object.keys(record).some(function (key) {
      return key.charAt(0) !== '_' && record[key] !== '' && record[key] !== null && record[key] !== undefined;
    });
  });
}

function getFleetRecords_() {
  const records = getRecords_('fleet');
  const defaultProject = inferDefaultProject_();
  const byPlate = {};
  records.filter(function (v) { return v.plate; }).forEach(function (v) {
    v.project = v.project || defaultProject;
    applyVehicleCycleDefaults_(v);
    byPlate[v.plate] = v;
  });
  return Object.keys(byPlate).map(function (plate) { return byPlate[plate]; });
}

function findHeader_(values, schema) {
  let best = null;
  const aliasIndex = buildAliasIndex_(schema.fields);
  const maxRows = Math.min(values.length, 30);
  for (let r = 0; r < maxRows; r++) {
    const map = {};
    values[r].forEach(function (cell, c) {
      const field = aliasIndex[normalize_(cell)];
      if (field && map[field] === undefined) map[field] = c;
    });
    const score = Object.keys(map).length;
    if (!best || score > best.score) best = { rowIndex: r, map: map, score: score };
  }
  return best && best.score >= schema.minMatches ? best : null;
}

function buildAliasIndex_(fields) {
  const out = {};
  Object.keys(fields).forEach(function (field) {
    fields[field].forEach(function (alias) { out[normalize_(alias)] = field; });
  });
  return out;
}

function normalizeRecord_(schemaKey, record) {
  Object.keys(record).forEach(function (key) {
    if (key === '_row') return;
    if (record[key] instanceof Date) record[key] = new Date(record[key].getTime());
    if (typeof record[key] === 'string') record[key] = record[key].trim();
  });
  if (schemaKey === 'fleet') {
    record.plate = asPlate_(record.plate);
    record.project = asText_(record.project);
    record.type = asText_(record.type);
    record.brand = asText_(record.brand);
    record.model = asText_(record.model);
    applyVehicleCycleDefaults_(record);
  }
  if (schemaKey === 'routes') {
    record.plate = asPlate_(record.plate);
    record.kmStart = number_(record.kmStart);
    record.kmEnd = number_(record.kmEnd);
    record.kms = number_(record.kms) || Math.max(0, record.kmEnd - record.kmStart);
    record.hours = number_(record.hours);
    record.gallons = number_(record.gallons);
  }
  if (schemaKey === 'maintenance') {
    record.plate = asPlate_(record.plate);
    record.type = asText_(record.type);
    record.odometer = number_(record.odometer);
    record.kmBetween = number_(record.kmBetween);
    record.correctiveTime = number_(record.correctiveTime);
    record.preventiveTime = number_(record.preventiveTime);
    record.cost = number_(record.cost);
  }
  return record;
}

function buildStats_(filters, fleet) {
  const byPlate = {};
  fleet.forEach(function (v) { byPlate[v.plate] = emptyMonthlyStats_(); });
  const total = emptyMonthlyStats_();
  const fleetByPlate = indexBy_(fleet, 'plate');

  getRecords_('routes').forEach(function (route) {
    const vehicle = fleetByPlate[route.plate];
    if (!vehicle) return;
    route = prepareRouteForVehicle_(route, vehicle);
    const date = toDate_(route.endDate) || toDate_(route.startDate);
    if (!date || date.getFullYear() !== filters.year) return;
    const m = date.getMonth();
    const target = byPlate[route.plate].months[m];
    const all = total.months[m];
    addRouteToMonth_(target, route);
    addRouteToMonth_(all, route);
  });

  getRecords_('maintenance').forEach(function (mnt) {
    const vehicle = fleetByPlate[mnt.plate];
    if (!vehicle) return;
    const date = toDate_(mnt.exitDate) || toDate_(mnt.entryDate);
    if (!date || date.getFullYear() !== filters.year) return;
    const m = date.getMonth();
    const target = byPlate[mnt.plate].months[m];
    const all = total.months[m];
    addMaintenanceToMonth_(target, mnt);
    addMaintenanceToMonth_(all, mnt);
  });

  Object.keys(byPlate).forEach(function (plate) { finalizeMonthly_(byPlate[plate]); });
  finalizeMonthly_(total);
  return { byPlate: byPlate, total: total };
}

function emptyMonthlyStats_() {
  return {
    months: APP_CONFIG.monthNames.map(function (_, i) {
      return {
        month: APP_CONFIG.monthNames[i],
        kms: 0,
        hours: 0,
        gallons: 0,
        preventive: 0,
        motorPreventive: 0,
        corrective: 0,
        maintenance: 0,
        plannedHours: 0,
        downtimeHours: 0,
        preventiveDowntimeHours: 0,
        correctiveDowntimeHours: 0,
        preventiveCost: 0,
        correctiveCost: 0,
        maintenanceCost: 0,
        kmBetweenMaintenance: 0,
        kmBetweenPreventive: 0,
        mttr: 0,
        mtbf: 0,
        availability: 100,
        operationalAvailability: 100,
        failureRate: 0
      };
    })
  };
}

function addRouteToMonth_(month, route) {
  month.kms += number_(route.kms);
  month.hours += number_(route.hours);
  month.plannedHours += routePlannedHours_(route);
  month.gallons += number_(route.gallons);
}

function addMaintenanceToMonth_(month, mnt) {
  const type = normalize_(mnt.type);
  const isCorrective = type.indexOf('correctivo') >= 0 || type.indexOf('correct') >= 0;
  const isPreventive = type.indexOf('preventivo') >= 0 || type.indexOf('prevent') >= 0 || type.indexOf('prev') >= 0;
  const isMotorPreventive = !isCorrective && type.indexOf('preventivo') >= 0 && type.indexOf('caja') < 0 && type.indexOf('corona') < 0;
  if (isCorrective) month.corrective += 1;
  if (isPreventive && !isCorrective) month.preventive += 1;
  month.maintenance += 1;
  month.kmBetweenMaintenance += number_(mnt.kmBetween);
  if (isMotorPreventive) {
    month.motorPreventive += 1;
    month.kmBetweenPreventive += number_(mnt.kmBetween);
  }
  const correctiveHours = isCorrective ? maintenanceCorrectiveHours_(mnt) : 0;
  const preventiveHours = isPreventive && !isCorrective ? maintenancePreventiveHours_(mnt) : 0;
  const hours = correctiveHours + preventiveHours;
  const cost = number_(mnt.cost);
  month.downtimeHours += hours;
  month.maintenanceCost += cost;
  if (isCorrective) {
    month.correctiveDowntimeHours += correctiveHours;
    month.correctiveCost += cost;
  }
  if (isPreventive && !isCorrective) {
    month.preventiveDowntimeHours += preventiveHours;
    month.preventiveCost += cost;
  }
}

function finalizeMonthly_(monthly) {
  monthly.months.forEach(function (m) {
    const failures = number_(m.corrective);
    const programmedHours = number_(m.hours) || number_(m.plannedHours);
    const preventiveTime = number_(m.preventiveDowntimeHours);
    const correctiveTime = number_(m.correctiveDowntimeHours);
    const downtime = preventiveTime + correctiveTime;
    const availableTime = Math.max(0, programmedHours - downtime);
    m.mtbf = failures ? safeDiv_(availableTime, failures) : availableTime;
    m.mttr = failures ? safeDiv_(correctiveTime, failures) : 0;
    m.failureRate = programmedHours ? safeDiv_(failures, programmedHours) : 0;
    m.availability = (m.mtbf + m.mttr) ? safeDiv_(m.mtbf, m.mtbf + m.mttr) * 100 : 100;
    m.operationalAvailability = programmedHours ? safeDiv_(availableTime, programmedHours) * 100 : 100;
  });
  return monthly;
}

function KPI_DEFINITIONS_(metric) {
  metric = metric || vehicleMetric_({}, []);
  return [
    { key: 'kms', label: metric.totalLabel, unit: metric.unit, decimals: 0, value: function (m) { return operatingValue_(m, metric); }, total: function (x) { return sumOperatingMonths_(x, metric); } },
    { key: 'gallons', label: 'Galones cargados', unit: 'gal', decimals: 2, value: function (m) { return m.gallons; }, total: function (x) { return sumMonths_(x, 'gallons'); } },
    { key: 'kmPerGallon', label: metric.perFuelLabel, unit: metric.perFuelUnit, decimals: 2, value: function (m) { return safeDiv_(operatingValue_(m, metric), m.gallons); }, total: function (x) { return safeDiv_(sumOperatingMonths_(x, metric), sumMonths_(x, 'gallons')); } },
    { key: 'preventive', label: 'Mantenimientos preventivos', unit: 'und', decimals: 0, value: function (m) { return m.preventive; }, total: function (x) { return sumMonths_(x, 'preventive'); } },
    { key: 'corrective', label: 'Mantenimientos correctivos', unit: 'und', decimals: 0, value: function (m) { return m.corrective; }, total: function (x) { return sumMonths_(x, 'corrective'); } },
    { key: 'kmPerMaintenance', label: metric.perMaintenanceLabel, unit: metric.perMaintenanceUnit, decimals: 0, value: function (m) { return safeDiv_(m.kmBetweenPreventive, m.motorPreventive); }, total: function (x) { return safeDiv_(sumMonths_(x, 'kmBetweenPreventive'), sumMonths_(x, 'motorPreventive')); } },
    { key: 'mttr', label: 'MTTR', unit: 'h', decimals: 1, value: function (m) { return m.mttr; }, total: function (x) { return avgMonths_(x, 'mttr'); } },
    { key: 'mtbf', label: 'MTBF', unit: metric.mtbfUnit, decimals: 1, value: function (m) { return m.mtbf; }, total: function (x) { return avgMonths_(x, 'mtbf'); } },
    { key: 'availability', label: 'Disponibilidad MTBF / MTTR', unit: '%', decimals: 1, value: function (m) { return m.availability; }, total: function (x) { return avgMonths_(x, 'availability'); } },
    { key: 'operationalAvailability', label: 'Disponibilidad operativa', unit: '%', decimals: 1, value: function (m) { return m.operationalAvailability; }, total: function (x) { return avgMonths_(x, 'operationalAvailability'); } }
  ];
}

function summarizeMonthly_(monthly, metric) {
  metric = metric || vehicleMetric_({}, []);
  const operatingTotal = sumOperatingMonths_(monthly, metric);
  return {
    kms: round_(operatingTotal, 0),
    gallons: round_(sumMonths_(monthly, 'gallons'), 2),
    kmPerGallon: round_(safeDiv_(operatingTotal, sumMonths_(monthly, 'gallons')), 2),
    preventive: round_(sumMonths_(monthly, 'preventive'), 0),
    corrective: round_(sumMonths_(monthly, 'corrective'), 0),
    kmPerMaintenance: round_(safeDiv_(sumMonths_(monthly, 'kmBetweenPreventive'), sumMonths_(monthly, 'motorPreventive')), 0),
    mttr: round_(avgMonths_(monthly, 'mttr'), 1),
    mtbf: round_(avgMonths_(monthly, 'mtbf'), 1),
    availability: round_(avgMonths_(monthly, 'availability'), 1),
    operationalAvailability: round_(avgMonths_(monthly, 'operationalAvailability'), 1),
    failureRate: round_(avgMonths_(monthly, 'failureRate'), 4)
  };
}

function chartSeriesFromMonthly_(monthly, filters, expectedCycle, metric) {
  metric = metric || vehicleMetric_({}, []);
  expectedCycle = number_(expectedCycle) || 0;
  return monthly.months.map(function (m) {
    const monthNumber = APP_CONFIG.monthNames.indexOf(m.month) + 1;
    const operatingValue = operatingValue_(m, metric);
    const motorPreventiveCount = number_(m.motorPreventive);
    const actualKmPerMaintenance = motorPreventiveCount ? safeDiv_(m.kmBetweenPreventive, motorPreventiveCount) : 0;
    return {
      month: m.month,
      selected: Number(filters.month || 0) === monthNumber,
      kms: round_(operatingValue, 0),
      rawKms: round_(m.kms, 0),
      hours: round_(m.hours, 1),
      gallons: round_(m.gallons, 2),
      kmPerGallon: round_(safeDiv_(operatingValue, m.gallons), 2),
      kmPerMaintenance: round_(actualKmPerMaintenance, 0),
      expectedKmPerMaintenance: round_(expectedCycle, 0),
      maintenanceDeviation: round_(actualKmPerMaintenance - expectedCycle, 0),
      preventive: m.preventive,
      motorPreventive: m.motorPreventive,
      corrective: m.corrective,
      preventiveCost: round_(m.preventiveCost, 2),
      correctiveCost: round_(m.correctiveCost, 2),
      maintenanceCost: round_(m.maintenanceCost, 2),
      mttr: round_(m.mttr, 1),
      mtbf: round_(m.mtbf, 1),
      plannedHours: round_(m.hours || m.plannedHours, 1),
      preventiveTime: round_(m.preventiveDowntimeHours, 1),
      correctiveTime: round_(m.correctiveDowntimeHours, 1),
      downtimeHours: round_(m.downtimeHours, 1),
      availability: round_(m.availability, 1),
      operationalAvailability: round_(m.operationalAvailability, 1)
    };
  });
}

function expectedMaintenanceCycle_(selectedVehicle, fleet) {
  if (selectedVehicle && selectedVehicle.plate) return number_(selectedVehicle.motorCycleKm) || expectedCycleByBrand_(selectedVehicle);
  const cycles = fleet.map(function (v) { return number_(v.motorCycleKm) || expectedCycleByBrand_(v); }).filter(function (n) { return n > 0; });
  return cycles.length ? safeDiv_(cycles.reduce(function (sum, n) { return sum + n; }, 0), cycles.length) : 0;
}

function expectedCycleByBrand_(vehicle) {
  const text = normalize_([vehicle.brand, vehicle.model, vehicle.type].join(' '));
  if (isHourBasedVehicle_(vehicle)) return 250;
  if (text.indexOf('daf') >= 0) return 8000;
  if (text.indexOf('shacman') >= 0 || text.indexOf('shacm') >= 0) return 8000;
  if (text.indexOf('hino') >= 0) return 6000;
  if (text.indexOf('chevrolet') >= 0 || text.indexOf('camioneta') >= 0) return 6000;
  return number_(vehicle.motorCycleKm) || 8000;
}

function isHourBasedVehicle_(vehicle) {
  vehicle = vehicle || {};
  const text = normalize_([vehicle.type, vehicle.brand, vehicle.model, vehicle.plate].join(' '));
  return text.indexOf('vacuum') >= 0 || text.indexOf('vacu') >= 0;
}

function motorCycleDefault_(vehicle) {
  return isHourBasedVehicle_(vehicle) ? 250 : 8000;
}

function boxCycleDefault_(vehicle) {
  return isHourBasedVehicle_(vehicle) ? 5000 : 60000;
}

function applyVehicleCycleDefaults_(vehicle) {
  if (!vehicle) return vehicle;
  vehicle.motorCycleKm = number_(vehicle.motorCycleKm) || motorCycleDefault_(vehicle);
  vehicle.boxCycleKm = number_(vehicle.boxCycleKm) || boxCycleDefault_(vehicle);
  return vehicle;
}

function vehicleMetric_(selectedVehicle, fleet) {
  selectedVehicle = selectedVehicle || {};
  const hasSelectedVehicle = Boolean(selectedVehicle.plate);
  const hourBased = hasSelectedVehicle
    ? isHourBasedVehicle_(selectedVehicle)
    : Boolean(fleet && fleet.length && fleet.every(isHourBasedVehicle_));
  return {
    isHourBased: hourBased,
    unit: hourBased ? 'h' : 'km',
    totalLabel: hourBased ? 'Horas trabajadas' : 'Km recorridos',
    totalTitle: hourBased ? 'Horas trabajadas totales' : 'Kilometros recorridos totales',
    currentLabel: hourBased ? 'Horas actuales' : 'Km actual',
    perFuelLabel: hourBased ? 'Horas / galon' : 'Km / galon',
    perFuelUnit: hourBased ? 'h/gal' : 'km/gal',
    perMaintenanceLabel: hourBased ? 'Horas / mantenimiento' : 'Km / mantenimiento',
    perMaintenanceUnit: hourBased ? 'h/mto' : 'km/mto',
    maintenanceTitle: hourBased ? 'Horas por mantenimiento' : 'Kilometros por mantenimiento',
    mtbfUnit: hourBased ? 'h/falla' : 'km/falla'
  };
}

function operatingValue_(month, metric) {
  return metric && metric.isHourBased ? number_(month.hours) : number_(month.kms);
}

function sumOperatingMonths_(monthly, metric) {
  return sumMonths_(monthly, metric && metric.isHourBased ? 'hours' : 'kms');
}

function summarizeSelectedPeriod_(monthly, filters, metric) {
  metric = metric || vehicleMetric_({}, []);
  if (!filters.month) return summarizeMonthly_(monthly, metric);
  const m = monthly.months[filters.month - 1] || {};
  const operatingValue = operatingValue_(m, metric);
  return {
    kms: round_(operatingValue, 0),
    gallons: round_(m.gallons, 2),
    kmPerGallon: round_(safeDiv_(operatingValue, m.gallons), 2),
    preventive: round_(m.preventive, 0),
    corrective: round_(m.corrective, 0),
    kmPerMaintenance: round_(safeDiv_(m.kmBetweenPreventive, m.motorPreventive), 0),
    mttr: round_(m.mttr, 1),
    mtbf: round_(m.mtbf, 1),
    availability: round_(m.availability, 1),
    operationalAvailability: round_(m.operationalAvailability, 1),
    failureRate: round_(m.failureRate, 4)
  };
}

function buildRanking_(byPlate, fleet) {
  return fleet.map(function (v) {
    const monthly = byPlate[v.plate] || emptyMonthlyStats_();
    const summary = summarizeMonthly_(monthly);
    return {
      plate: v.plate,
      project: v.project,
      type: v.type,
      brand: v.brand,
      kms: summary.kms,
      gallons: summary.gallons,
      kmPerGallon: summary.kmPerGallon,
      availability: summary.availability,
      corrective: summary.corrective
    };
  }).sort(function (a, b) { return b.kms - a.kms; });
}

function buildAlerts_(fleet) {
  const routesByPlate = latestRouteByPlate_();
  const maintenanceByPlate = latestMaintenanceByPlate_();
  return fleet.map(function (v) {
    const latestRoute = routesByPlate[v.plate] || {};
    const latestMaintenance = maintenanceByPlate[v.plate] || {};
    const metric = vehicleMetric_(v, fleet);
    const motorCycle = number_(v.motorCycleKm) || motorCycleDefault_(v);
    const boxCycle = number_(v.boxCycleKm) || boxCycleDefault_(v);
    const currentKm = metric.isHourBased
      ? (number_(latestRoute.currentHours) || number_(latestRoute.currentKm) || number_(v.currentKm) || number_(v.initialKm))
      : (number_(latestRoute.currentKm) || number_(v.currentKm) || number_(v.initialKm));
    const lastMotorKm = number_(latestMaintenance.motorKm) || number_(v.lastPreventiveKm) || number_(v.initialKm);
    const lastBoxKm = number_(latestMaintenance.boxKm);
    const nextMotorKm = lastMotorKm + motorCycle;
    const nextBoxKm = lastBoxKm ? lastBoxKm + boxCycle : 0;
    const kmToMaintenance = nextMotorKm - currentKm;
    const lifePercent = safeDiv_(kmToMaintenance, motorCycle) * 100;
    const boundedLife = Math.max(0, Math.min(100, lifePercent));
    let severity = 'ok';
    if (kmToMaintenance <= 0 || boundedLife <= 10) severity = 'critical';
    else if (boundedLife <= 35) severity = 'warning';
    return {
      plate: v.plate,
      project: v.project,
      type: v.type,
      brand: v.brand,
      model: v.model,
      description: vehicleDescription_(v),
      currentKm: round_(currentKm, 0),
      currentKmDate: valueToJson_(latestRoute.date),
      motorCycleKm: motorCycle,
      boxCycleKm: boxCycle,
      measureUnit: metric.unit,
      measureLabel: metric.totalLabel,
      isHourBased: metric.isHourBased,
      cycleKm: motorCycle,
      lastBoxMaintenanceKm: round_(lastBoxKm, 0),
      lastMotorMaintenanceKm: round_(lastMotorKm, 0),
      lastMotorMaintenanceDate: valueToJson_(latestMaintenance.motorDate),
      nextMotorMaintenanceKm: round_(nextMotorKm, 0),
      nextBoxMaintenanceKm: round_(nextBoxKm, 0),
      kmToMaintenance: round_(kmToMaintenance, 0),
      lifePercent: round_(boundedLife, 1),
      severity: severity,
      message: severity === 'critical' ? 'Mantenimiento inmediato' : severity === 'warning' ? 'Cerca de mantenimiento' : 'Dentro de rango'
    };
  }).sort(function (a, b) {
    const order = { critical: 0, warning: 1, ok: 2 };
    return order[a.severity] - order[b.severity] || a.kmToMaintenance - b.kmToMaintenance;
  });
}

function latestRouteByPlate_() {
  return getRecords_('routes').reduce(function (acc, route) {
    const plate = asPlate_(route.plate);
    if (!plate) return acc;
    const date = toDate_(route.endDate) || toDate_(route.startDate);
    const currentKm = number_(route.kmEnd) || number_(route.kms);
    const hours = number_(route.hours) || number_(route.kms);
    const previous = acc[plate] || { currentKm: 0, currentHours: 0, date: null };
    if (hours) previous.currentHours += hours;
    if (currentKm && (!previous.currentKm || compareDates_(date, previous.date) >= 0 || currentKm > previous.currentKm)) {
      previous.currentKm = currentKm;
    }
    if (date && (!previous.date || compareDates_(date, previous.date) >= 0)) {
      previous.date = date;
    }
    acc[plate] = previous;
    return acc;
  }, {});
}

function latestMaintenanceByPlate_() {
  return getRecords_('maintenance').reduce(function (acc, mnt) {
    const plate = asPlate_(mnt.plate);
    if (!plate) return acc;
    const date = toDate_(mnt.exitDate) || toDate_(mnt.entryDate);
    const km = number_(mnt.odometer);
    if (!km) return acc;
    const bucket = acc[plate] || {};
    if (isBoxMaintenance_(mnt)) {
      if (!bucket.boxDate || compareDates_(date, bucket.boxDate) >= 0 || km > number_(bucket.boxKm)) {
        bucket.boxKm = km;
        bucket.boxDate = date;
      }
    } else if (isMotorMaintenance_(mnt)) {
      if (!bucket.motorDate || compareDates_(date, bucket.motorDate) >= 0 || km > number_(bucket.motorKm)) {
        bucket.motorKm = km;
        bucket.motorDate = date;
      }
    }
    acc[plate] = bucket;
    return acc;
  }, {});
}

function isBoxMaintenance_(mnt) {
  const text = normalize_([mnt.type, mnt.package, mnt.cause, mnt.observations].join(' '));
  return text.indexOf('caja') >= 0 || text.indexOf('corona') >= 0 || text.indexOf('diferencial') >= 0 || text.indexOf('transmision') >= 0;
}

function isMotorMaintenance_(mnt) {
  const text = normalize_([mnt.type, mnt.package, mnt.cause, mnt.observations].join(' '));
  if (isBoxMaintenance_(mnt)) return false;
  return text.indexOf('prevent') >= 0 || text.indexOf('motor') >= 0 || text.indexOf('aceite') >= 0 || text.indexOf('mantenimiento') >= 0;
}

function vehicleDescription_(vehicle) {
  return [vehicle.type, vehicle.brand, vehicle.model].filter(Boolean).join(' / ');
}

function compareDates_(a, b) {
  const at = a instanceof Date ? a.getTime() : 0;
  const bt = b instanceof Date ? b.getTime() : 0;
  return at - bt;
}

function buildStatusBreakdown_(fleet, byPlate) {
  const alerts = buildAlerts_(fleet, byPlate);
  return {
    ok: alerts.filter(function (a) { return a.severity === 'ok'; }).length,
    warning: alerts.filter(function (a) { return a.severity === 'warning'; }).length,
    critical: alerts.filter(function (a) { return a.severity === 'critical'; }).length
  };
}

function currentKmForVehicle_(vehicle, monthly) {
  const yearlyKm = sumMonths_(monthly, 'kms');
  return Math.max(number_(vehicle.currentKm), number_(vehicle.initialKm) + yearlyKm);
}

function appendCanonicalRow_(key, row) {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(SCHEMAS[key].sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(SCHEMAS[key].sheetName);
    sheet.getRange(1, 1, 1, WRITE_HEADERS[key].length).setValues([WRITE_HEADERS[key]]);
  }
  const values = sheet.getDataRange().getValues();
  let header = findHeader_(values, SCHEMAS[key]);
  if (!header) {
    sheet.clear();
    sheet.getRange(1, 1, 1, WRITE_HEADERS[key].length).setValues([WRITE_HEADERS[key]]);
    header = findHeader_(sheet.getDataRange().getValues(), SCHEMAS[key]);
  }
  const rowIndex = sheet.getLastRow() + 1;
  const width = Math.max(sheet.getLastColumn(), values[header.rowIndex].length);
  const out = new Array(width).fill('');
  Object.keys(header.map).forEach(function (field) {
    if (row[field] !== undefined) out[header.map[field]] = coerceWriteValue_(row[field]);
  });
  if (header.map.number !== undefined) out[header.map.number] = rowIndex - header.rowIndex - 1;
  sheet.getRange(rowIndex, 1, 1, out.length).setValues([out]);
  return { ok: true, row: rowIndex };
}

function fleetPlateExists_(plate) {
  plate = asPlate_(plate);
  if (!plate) return false;
  return getRecords_('fleet').some(function (vehicle) {
    return equals_(vehicle.plate, plate);
  });
}

function maintenanceDuplicateKeyFromRow_(row, map) {
  const plate = asPlate_(row[map.plate]);
  if (!plate) return '';
  const parts = [
    plate,
    normalize_(map.workshop === undefined ? '' : row[map.workshop]),
    duplicateDateKey_(map.entryDate === undefined ? '' : row[map.entryDate]),
    duplicateDateKey_(map.exitDate === undefined ? '' : row[map.exitDate]),
    normalize_(map.type === undefined ? '' : row[map.type]),
    number_(map.odometer === undefined ? '' : row[map.odometer]),
    number_(map.kmBetween === undefined ? '' : row[map.kmBetween]),
    normalize_(map.package === undefined ? '' : row[map.package]),
    normalize_(map.orderNumber === undefined ? '' : row[map.orderNumber]),
    normalize_(map.mechanic === undefined ? '' : row[map.mechanic])
  ];
  return parts.join('|');
}

function routeDuplicateKeyFromRow_(row, map) {
  const plate = asPlate_(row[map.plate]);
  if (!plate) return '';
  const parts = [
    plate,
    duplicateDateKey_(map.startDate === undefined ? '' : row[map.startDate]),
    duplicateDateKey_(map.endDate === undefined ? '' : row[map.endDate]),
    number_(map.kmStart === undefined ? '' : row[map.kmStart]),
    number_(map.kmEnd === undefined ? '' : row[map.kmEnd]),
    number_(map.kms === undefined ? '' : row[map.kms]),
    number_(map.hours === undefined ? '' : row[map.hours]),
    number_(map.gallons === undefined ? '' : row[map.gallons]),
    normalize_(map.observations === undefined ? '' : row[map.observations])
  ];
  return parts.join('|');
}

function duplicateDateKey_(value) {
  const date = toDate_(value);
  if (!date) return normalize_(value);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function importFleetRowsWithoutDuplicates_(rows) {
  const existing = {};
  getRecords_('fleet').forEach(function (vehicle) {
    const plate = asPlate_(vehicle.plate);
    if (plate) existing[plate] = true;
  });

  let inserted = 0;
  let skipped = 0;
  const skippedPlates = [];
  rows.forEach(function (row) {
    row = row || {};
    row.plate = asPlate_(row.plate);
    if (!row.plate) {
      skipped++;
      return;
    }
    if (existing[row.plate]) {
      skipped++;
      skippedPlates.push(row.plate);
      return;
    }
    row.project = row.project || APP_CONFIG.defaultProject;
    applyVehicleCycleDefaults_(row);
    appendCanonicalRow_('fleet', row);
    existing[row.plate] = true;
    inserted++;
  });
  return { ok: true, inserted: inserted, skipped: skipped, skippedPlates: skippedPlates };
}

function renumberSheet_(sheet, key) {
  const values = sheet.getDataRange().getValues();
  const header = findHeader_(values, SCHEMAS[key]);
  if (!header || header.map.number === undefined) return;
  const count = Math.max(0, sheet.getLastRow() - header.rowIndex - 1);
  if (!count) return;
  const numbers = [];
  for (let i = 1; i <= count; i++) numbers.push([i]);
  sheet.getRange(header.rowIndex + 2, header.map.number + 1, count, 1).setValues(numbers);
}

function coerceImportedRow_(key, obj) {
  const schema = SCHEMAS[key];
  const aliases = buildAliasIndex_(schema.fields);
  const out = {};
  Object.keys(obj).forEach(function (name) {
    const field = aliases[normalize_(name)] || name;
    out[field] = obj[name];
  });
  return out;
}

function filterVehicles_(vehicles, filters) {
  return vehicles.filter(function (v) {
    if (filters.project && !equals_(v.project, filters.project)) return false;
    if (filters.plate && !equals_(v.plate, filters.plate)) return false;
    if (filters.type && !equals_(v.type, filters.type)) return false;
    if (filters.brand && !equals_(v.brand, filters.brand)) return false;
    return true;
  });
}

function normalizeFilters_(filters) {
  filters = filters || {};
  return {
    project: asText_(filters.project),
    plate: asPlate_(filters.plate),
    type: asText_(filters.type),
    brand: asText_(filters.brand),
    year: Number(filters.year) || new Date().getFullYear(),
    month: Number(filters.month) || 0
  };
}

function inferDefaultProject_() {
  const sheet = getSpreadsheet_().getSheetByName(APP_CONFIG.sheetNames.fleet);
  if (!sheet) return APP_CONFIG.defaultProject;
  const text = sheet.getRange(1, 1, Math.min(5, sheet.getMaxRows()), Math.min(10, sheet.getMaxColumns())).getDisplayValues().flat().join(' ');
  const hit = APP_CONFIG.projectOptions.find(function (p) { return normalize_(text).indexOf(normalize_(p)) >= 0; });
  return hit || APP_CONFIG.defaultProject;
}

function getYearsFromRecords_(records, dateFields) {
  const years = [];
  records.forEach(function (r) {
    dateFields.forEach(function (field) {
      const d = toDate_(r[field]);
      if (d) years.push(d.getFullYear());
    });
  });
  return unique_(years);
}

function maintenanceHours_(mnt) {
  const explicit = number_(mnt.correctiveTime) + number_(mnt.preventiveTime);
  if (explicit) return explicit;
  return maintenanceDateHours_(mnt);
}

function maintenanceCorrectiveHours_(mnt) {
  const explicit = number_(mnt.correctiveTime) || number_(mnt.preventiveTime);
  if (explicit) return explicit;
  return maintenanceDateHours_(mnt);
}

function maintenancePreventiveHours_(mnt) {
  const explicit = number_(mnt.preventiveTime) || number_(mnt.correctiveTime);
  if (explicit) return explicit;
  return maintenanceDateHours_(mnt);
}

function maintenanceDateHours_(mnt) {
  const entry = toDate_(mnt.entryDate);
  const exit = toDate_(mnt.exitDate);
  if (!entry || !exit) return 0;
  return Math.max(0, (exit.getTime() - entry.getTime()) / 3600000);
}

function routePlannedHours_(route) {
  const start = toDate_(route.startDate);
  const end = toDate_(route.endDate) || start;
  if (!start && !end) return 0;
  if (!start || !end) return 10;
  const startDay = dateOnlyTime_(start);
  const endDay = dateOnlyTime_(end);
  const diffDays = Math.floor((endDay - startDay) / 86400000) + 1;
  return Math.max(1, diffDays) * 10;
}

function dateOnlyTime_(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function buildExecutivePdfHtml_(data) {
  const metric = data.metric || vehicleMetric_(data.vehicle, []);
  const rows = data.monthlyKpis.map(function (row) {
    return '<tr><td>' + esc_(row.label) + '</td>' + row.values.map(function (v) { return '<td>' + esc_(v) + '</td>'; }).join('') + '<td>' + esc_(row.total) + '</td></tr>';
  }).join('');
  return '<html><head><style>body{font-family:Arial,sans-serif;color:#17202a}h1{color:#0f5f7a}.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.box{border:1px solid #d8dee6;padding:12px}.num{font-size:22px;font-weight:bold}table{width:100%;border-collapse:collapse;margin-top:18px}th,td{border:1px solid #d8dee6;padding:6px;text-align:right}th:first-child,td:first-child{text-align:left;background:#f3f7fa}</style></head><body><h1>Informe Ejecutivo de Flota</h1><p>Vehículo: ' + esc_(data.vehicle.plate || 'Todos') + ' | Proyecto: ' + esc_(data.filters.project || 'Todos') + ' | Año: ' + esc_(data.filters.year) + '</p><div class="kpis"><div class="box">' + esc_(metric.totalLabel) + '<div class="num">' + esc_(data.summary.kms) + ' ' + esc_(metric.unit) + '</div></div><div class="box">Galones<div class="num">' + esc_(data.summary.gallons) + '</div></div><div class="box">' + esc_(metric.perFuelLabel) + '<div class="num">' + esc_(data.summary.kmPerGallon) + '</div></div><div class="box">Disponibilidad<div class="num">' + esc_(data.summary.availability) + '%</div></div></div><table><thead><tr><th>Indicador</th>' + APP_CONFIG.monthNames.map(function (m) { return '<th>' + m + '</th>'; }).join('') + '<th>Total</th></tr></thead><tbody>' + rows + '</tbody></table></body></html>';
}

function buildAlertsPdfHtml_(data) {
  const rows = data.alerts.map(function (a) {
    const unit = a.measureUnit || 'km';
    return '<tr class="' + esc_(a.severity) + '"><td>' + esc_(a.description) + '</td><td class="plate">' + esc_(a.plate) + '</td><td>' + esc_(a.motorCycleKm) + ' ' + esc_(unit) + '</td><td>' + esc_(a.boxCycleKm) + ' ' + esc_(unit) + '</td><td>' + esc_(a.currentKm) + ' ' + esc_(unit) + '</td><td>' + esc_(formatDateForPdf_(a.currentKmDate)) + '</td><td>' + esc_(a.lastBoxMaintenanceKm || '') + '</td><td>' + esc_(a.lastMotorMaintenanceKm || '') + '</td><td>' + esc_(formatDateForPdf_(a.lastMotorMaintenanceDate)) + '</td><td>' + esc_(a.nextMotorMaintenanceKm) + '</td><td>' + esc_(a.nextBoxMaintenanceKm || '') + '</td><td class="faltan">' + esc_(a.kmToMaintenance) + ' ' + esc_(unit) + '</td><td class="vida">' + esc_(a.lifePercent) + '%</td></tr>';
  }).join('');
  return '<html><head><style>@page{size:landscape;margin:14mm}body{font-family:Arial,sans-serif;color:#17202a}h1{color:#0f5f7a;margin-bottom:4px}.meta{margin:0 0 12px;color:#5f6f7b}table{width:100%;border-collapse:collapse;font-size:8.4px}th{background:#075176;color:#fff;text-transform:uppercase}th,td{border:1px solid #8aa6b5;padding:4px;text-align:center}td:first-child{text-align:left}.plate{background:#ffd45a;font-weight:bold}.critical td{background:#ffd9d9}.warning td{background:#fff0c2}.ok .vida{background:#31d67b}.warning .vida{background:#ffb020}.critical .vida,.critical .faltan{background:#ff4d6d;color:#fff;font-weight:bold}</style></head><body><h1>Control de mantenimiento preventivo</h1><p class="meta">Proyecto: ' + esc_(data.filters.project || 'Todos') + ' | Generado: ' + esc_(Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm')) + '</p><table><thead><tr><th>Vehiculo / marca</th><th>Placa</th><th>Ciclo motor</th><th>Ciclo caja</th><th>Lectura actual</th><th>Fecha lectura</th><th>Ult. caja</th><th>Ult. motor</th><th>Fecha motor</th><th>Prox. motor</th><th>Prox. caja</th><th>Faltan motor</th><th>Vida util</th></tr></thead><tbody>' + rows + '</tbody></table></body></html>';
}

function formatDateForPdf_(value) {
  const date = toDate_(value);
  return date ? Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd') : '';
}

function publicVehicle_(v) {
  v = v || {};
  const metric = vehicleMetric_(v, []);
  return {
    plate: asText_(v.plate),
    project: asText_(v.project),
    type: asText_(v.type),
    brand: asText_(v.brand),
    model: asText_(v.model),
    motorSerial: asText_(v.motorSerial),
    chassisSerial: asText_(v.chassisSerial),
    year: valueToJson_(v.year),
    color: asText_(v.color),
    status: asText_(v.status),
    motorCycleKm: number_(v.motorCycleKm),
    boxCycleKm: number_(v.boxCycleKm),
    isHourBased: metric.isHourBased,
    measureUnit: metric.unit,
    measureLabel: metric.totalLabel
  };
}

function publicRecord_(record) {
  const out = {};
  Object.keys(record).forEach(function (key) { out[key] = valueToJson_(record[key]); });
  return out;
}

function valueToJson_(value) {
  if (value instanceof Date) return value.toISOString();
  if (value === null || value === undefined) return '';
  return value;
}

function coerceWriteValue_(value) {
  if (typeof value === 'string') {
    const d = toDate_(value);
    if (/^\d{4}-\d{2}-\d{2}/.test(value) && d) return d;
  }
  return value === undefined ? '' : value;
}

function toDate_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) return value;
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function number_(value) {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(String(value).replace(',', '.').replace(/[^\d.-]/g, ''));
  return isNaN(n) ? 0 : n;
}

function asText_(value) {
  return value === null || value === undefined ? '' : String(value).trim();
}

function asPlate_(value) {
  return asText_(value).toUpperCase();
}

function normalize_(value) {
  return asText_(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function equals_(a, b) {
  return normalize_(a) === normalize_(b);
}

function unique_(arr) {
  const seen = {};
  return arr.filter(function (item) {
    const key = normalize_(item);
    if (!key || seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function indexBy_(arr, key) {
  return arr.reduce(function (acc, item) {
    if (item[key]) acc[item[key]] = item;
    return acc;
  }, {});
}

function sumMonths_(monthly, key) {
  return monthly.months.reduce(function (a, m) { return a + number_(m[key]); }, 0);
}

function avgMonths_(monthly, key) {
  const values = monthly.months.map(function (m) { return number_(m[key]); }).filter(function (v) { return v > 0; });
  return values.length ? values.reduce(function (a, b) { return a + b; }, 0) / values.length : 0;
}

function safeDiv_(a, b) {
  return number_(b) ? number_(a) / number_(b) : 0;
}

function round_(value, decimals) {
  const p = Math.pow(10, decimals || 0);
  return Math.round(number_(value) * p) / p;
}

function esc_(value) {
  return asText_(value).replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
  });
}
