
import {
  obtenerAtracciones,
  obtenerDepartamentos,
  normalizarAtraccion
} from "../resources/data.mjs";

const contieneTexto = (texto, busqueda) =>
  String(texto ?? "").toLocaleLowerCase("es")
    .includes(String(busqueda ?? "").trim().toLocaleLowerCase("es"));

export const attractionResolvers = {
  Query: {
    attractions: async (_, { cityName, keyword, departmentName }) => {
      let atracciones = await obtenerAtracciones();

      // Filtrar por ciudad.
      if (cityName) {
        atracciones = atracciones.filter(
          a => contieneTexto(a.city?.name, cityName)
        );
      }

      // Filtrar por nombre o descripción.
      if (keyword) {
        atracciones = atracciones.filter(
          a =>
            contieneTexto(a.name, keyword) ||
            contieneTexto(a.description, keyword)
        );
      }

      // Filtrar por departamento.
      if (departmentName) {
        const departamentos = await obtenerDepartamentos();

        const departamento = departamentos.find(
          d => contieneTexto(d.name, departmentName)
        );

        if (!departamento) return [];

        atracciones = atracciones.filter(
          a =>
            a.city?.departmentId === departamento.id ||
            a.city?.department?.id === departamento.id
        );
      }

      return atracciones.map(normalizarAtraccion);
    },

    attraction: async (_, { id }) => {
      const atracciones = await obtenerAtracciones();

      const atraccion = atracciones.find(a => a.id === id);

      return atraccion ? normalizarAtraccion(atraccion) : null;
    },

    statistics: async () => {
      const [departamentos, atracciones] = await Promise.all([
        obtenerDepartamentos(),
        obtenerAtracciones()
      ]);

      return {
        totalDepartments: departamentos.length,
        totalAttractions: atracciones.length
      };
    }
  }
};
