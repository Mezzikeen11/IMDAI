export function buildRemureStorageKey(idDependencia) {
  return `remure_${idDependencia}`;
}

export const dataManager = {
  async cargarDatos(idDependencia) {
    try {
      const storageKey = buildRemureStorageKey(idDependencia);
      const raw = window.localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      console.warn(`No fue posible cargar REMURE para ${idDependencia}.`, error);
      return {};
    }
  },

  async guardarDatos(idDependencia, datosParaGuardar) {
    try {
      const storageKey = buildRemureStorageKey(idDependencia);
      window.localStorage.setItem(storageKey, JSON.stringify(datosParaGuardar));
      return true;
    } catch (error) {
      console.warn(`No fue posible guardar REMURE para ${idDependencia}.`, error);
      return false;
    }
  }
};