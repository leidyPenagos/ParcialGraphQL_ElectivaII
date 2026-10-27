
import {
  obtenerDepartamentos,
  obtenerCiudadesDepartamento,
  obtenerAtraccionesDepartamento,
  normalizarAtraccion
} from "../resources/data.mjs";

const compararTexto = (a, b) =>
  String(a ?? "").toLocaleLowerCase("es")
    .includes(String(b ?? "").toLocaleLowerCase("es"));

export const departmentResolvers = {
  Query: {
    departments: async (_, args) => {
      let departamentos = await obtenerDepartamentos();

      if (args.populationMin != null) {
        departamentos = departamentos.filter(
          d => Number(d.population) >= args.populationMin
        );
      }

      if (args.populationMax != null) {
        departamentos = departamentos.filter(
          d => Number(d.population) <= args.populationMax
        );
      }

      if (args.nameContains) {
        departamentos = departamentos.filter(
          d => compararTexto(d.name, args.nameContains)
        );
      }

      return departamentos;
    },

    department: async (_, { id, name }) => {
      const departamentos = await obtenerDepartamentos();

      if (id != null) {
        return departamentos.find(d => d.id === id) ?? null;
      }

      if (name) {
        return departamentos.find(
          d => String(d.name).toLocaleLowerCase("es") ===
            name.trim().toLocaleLowerCase("es")
        ) ?? null;
      }

      throw new Error("Debes proporcionar el ID o el nombre.");
    },

    topPopulatedDepartments: async (_, { limit }) => {
      const departamentos = await obtenerDepartamentos();

      const cantidad = Math.max(1, Math.min(limit ?? 5, 32));

      return departamentos
        .filter(d => Number.isFinite(Number(d.population)))
        .sort((a, b) => Number(b.population) - Number(a.population))
        .slice(0, cantidad);
    },

    citiesByDepartment: async (_, { departmentId }) => {
      return obtenerCiudadesDepartamento(departmentId);
    }
  },

  Department: {
    capital: async (departamento) => {
      if (!departamento.cityCapitalId) return null;

      const ciudades = await obtenerCiudadesDepartamento(
        departamento.id
      );

      return ciudades.find(
        ciudad => ciudad.id === departamento.cityCapitalId
      ) ?? null;
    },

    attractions: async (departamento) => {
      const atracciones = await obtenerAtraccionesDepartamento(
        departamento.id
      );

      return atracciones.map(normalizarAtraccion);
    }
  }
};
