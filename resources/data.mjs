
const API_BASE_URL =
  process.env.API_BASE_URL || "https://api-colombia.com/api/v1";

// Función general para consultar API-Colombia.
async function consultarAPI(endpoint) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    console.log(`Consultando API: ${url}`);

    const respuesta = await fetch(url, {
      headers: {
        Accept: "application/json"
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!respuesta.ok) {
      throw new Error(
        `Error HTTP ${respuesta.status} al consultar ${endpoint}`
      );
    }

    return await respuesta.json();
  } catch (error) {
    console.error(`Error en ${url}:`, error.message);
    throw error;
  }
}

// Obtener todos los departamentos.
export async function obtenerDepartamentos() {
  return consultarAPI("/Department");
}

// Obtener todas las atracciones turísticas.
export async function obtenerAtracciones() {
  return consultarAPI("/TouristicAttraction");
}

// Obtener las atracciones turísticas de un departamento.
export async function obtenerAtraccionesDepartamento(id) {
  return consultarAPI(`/Department/${id}/touristicattractions`);
}

// Obtener las ciudades de un departamento.
export async function obtenerCiudadesDepartamento(id) {
  return consultarAPI(`/Department/${id}/cities`);
}

// Normalizar los datos de una ciudad.
export function normalizarCiudad(ciudad) {
  if (!ciudad) {
    return null;
  }

  return {
    id: ciudad.id ?? null,
    name: ciudad.name ?? null,
    description: ciudad.description ?? null,
    surface: ciudad.surface ?? null,
    population: ciudad.population ?? null,
    postalCode: ciudad.postalCode ?? null,
    departmentId:
      ciudad.departmentId ?? ciudad.department?.id ?? null
  };
}

// Normalizar los datos de una atracción turística.
export function normalizarAtraccion(atraccion) {
  if (!atraccion) {
    return null;
  }

  return {
    id: atraccion.id ?? null,
    name: atraccion.name ?? "",
    description: atraccion.description ?? "",
    latitude:
      atraccion.latitude == null
        ? null
        : String(atraccion.latitude),
    longitude:
      atraccion.longitude == null
        ? null
        : String(atraccion.longitude),
    cityId:
      atraccion.cityId ?? atraccion.city?.id ?? null,
    city: normalizarCiudad(atraccion.city)
  };
}
//normalizar los datos de un departamento.
  export function normalizarDepartamento(departamento) {
    if (!departamento) {
      return null;
    } 
    return {
      id: departamento.id ?? null,
      name: departamento.name ?? "",  
    description: departamento.description ?? "",
    surface: departamento.surface ?? null,
    population: departamento.population ?? null
  };

}
