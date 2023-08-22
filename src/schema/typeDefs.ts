export const userTypeDefs = `#graphql

  scalar Buffer

  extend type Query {
    user: User!
    users: [User!]!
    dailies: [DailyAndWeekly!]!
    weeklies: [DailyAndWeekly!]!
    item(id:String!): Item!
    items: [Item!]!
    spot(id: String!): Spot!
    spots: [Spot!]!
  }

  extend type Mutation {
    createDaily(newDaily: CreateDailyInput!): DailyAndWeekly!
    updateDaily(id: String!, updatedDaily: UpdateDailyInput!): DailyAndWeekly!
    deleteDaily(id: String!): Boolean!

    createWeekly(newWeekly: CreateWeeklyInput!): DailyAndWeekly!
    updateWeekly(id: String!, updatedWeekly: UpdateWeeklyInput!): DailyAndWeekly!
    deleteWeekly(id: String!): Boolean!

    updateDailyIsCompleted(id: String!): DailyAndWeekly!
    updateWeeklyIsCompleted(id: String!): DailyAndWeekly!

    createGoal(itemId: String!): Goal!
  }

  type User {
    id: String!
    username: String!
    avatar: String!
    dailies: [DailyAndWeekly!]!
    weeklies: [DailyAndWeekly!]!
    goals: [Goal!]!
    createdAt: String!
    updatedAt: String!
  }

  type DailyAndWeekly {
    id: String!
    userId: String!
    title: String!
    description: String!
    isCompleted: Boolean!
    resetDay: String!
    createdAt: String!
    updatedAt: String!
  }

  type Spot {
    id: String!
    name: String!
    image: Buffer
    drops: [Drop!]!
  }

  type Drop {
    id: String!
    name: String!
    image: Buffer
    price: Int!
    tax: Boolean!
  }

  type Item {
    id: String!
    name: String!
    price: Int!
    tier: Int!
    image: Buffer
    type: ItemType!
  }

  type Goal {
    id: String!
    item: Item!
  }

  enum ItemType {
    accessory
    weapon
    armor
  }

  enum MetaTypeInput {
    daily
    weekly
  }

  input CreateDailyInput {
    title: String!
    description: String!
    resetDay: String!
  }

  input UpdateDailyInput {
    title: String
    description: String
    resetDay: String
    isCompleted: Boolean
  }

  input CreateWeeklyInput {
    title: String!
    description: String!
    resetDay: String!
  }

  input UpdateWeeklyInput {
    title: String
    description: String
    resetDay: String
    isCompleted: Boolean
  }
`;
