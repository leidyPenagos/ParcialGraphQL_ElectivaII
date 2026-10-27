
export const typeDefs = /* GraphQL */ `
  type Department {
    id: Int
    name: String
    description: String
    cityCapitalId: Int
    municipalities: Int
    surface: Float
    population: Int
    phonePrefix: String
    capital: City
    attractions: [Attraction!]!
  }

  type City {
    id: Int
    name: String
    description: String
    surface: Float
    population: Int
    postalCode: String
    departmentId: Int
  }

  type Attraction {
    id: Int
    name: String
    description: String
    latitude: String
    longitude: String
    cityId: Int
    city: City
  }

  type Query {
    # Consultar departamentos con filtros opcionales.
    departments(
      populationMin: Int
      populationMax: Int
      nameContains: String
    ): [Department!]!

    # Consultar un departamento por ID o nombre.
    department(
      id: Int
      name: String
    ): Department

    # Consultar departamentos con mayor población.
    topPopulatedDepartments(limit: Int = 5): [Department!]!

    # Consultar atracciones por ciudad, palabra clave
    # o departamento.
    attractions(
      cityName: String
      keyword: String
      departmentName: String
    ): [Attraction!]!

    # Consultar una atracción por su ID.
    attraction(id: Int!): Attraction

    # Consultar las ciudades de un departamento.
    citiesByDepartment(departmentId: Int!): [City!]!

    # Consultar la cantidad de departamentos y atracciones.
    statistics: Statistics!
  }

  type Statistics {
    totalDepartments: Int!
    totalAttractions: Int!
  }
`;
