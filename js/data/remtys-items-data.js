export const remtysItems = [
  {
    id: "acta-defuncion",
    nombre: "Acta de Defunción",
    tipo: "tramite",
    categoria: "registro-civil-identidad",
    descripcion: "Expedición de copia certificada del acta de defunción.",

    sujetoObligado: {
      dependenciaResponsable: "Dirección de la Coordinación del Registro Civil",
      unidadAdministrativa: "Registro Civil",
      direccion: "SM 22, MZ 20, Calle Margaritas núm. 31, Cancún, Quintana Roo, C.P. 77500",
      googleMaps: "https://maps.google.com/?q=SM+22+MZ+20+Calle+Margaritas+31+Cancun+Quintana+Roo",
      telefono: "(998) 404 3833",
      extension: "No aplica",
      plataformasDigitales: "Información complementaria disponible en el portal del Registro Civil de Quintana Roo."
    },

    politicasLineamientos: {
      objetivo: "Expedición de copia certificada de actas de defunción.",
      realizacionPorVia: "Presencial",
      cargaTributaria: "Sí",
      montoTotal: "$207.00 MXN",
      desgloseCargaTributaria: "Pago de derechos por expedición de copia certificada.",
      tiempoResolucion: "El mismo día",
      resolucionObtenida: "Copia certificada del acta de defunción",
      horarioAtencion: "8:30 a 15:00 horas",
      tramiteVinculado: "Para registrar una defunción deberá acudirse al Registro Civil municipal que corresponda."
    },

    requisitos: [
      {
        requisito: "Copia simple del acta de defunción.",
        tipo: "Documento",
        cantidad: "1"
      },
      {
        requisito: "Nombre completo del difunto.",
        tipo: "Dato informativo",
        cantidad: "1"
      },
      {
        requisito: "Comprobante de pago de derechos.",
        tipo: "Comprobante",
        cantidad: "1"
      }
    ]
  }
];