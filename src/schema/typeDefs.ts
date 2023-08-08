import { gql } from "apollo-server";

export const userTypeDefs = gql`
  extend type Query {
    user(id: String!): User!
    users: [User!]!
    diaries(userId: String!): [DiaryAndWeekly!]!
    weeklies(userId: String!): [DiaryAndWeekly!]!
  }

  extend type Mutation {
    createDiary(data: CreateDiaryInput!): DiaryAndWeekly!
    updateDiary(id: String!, data: UpdateDiaryInput!): DiaryAndWeekly!
    deleteDiary(id: String!): Boolean!

    createWeekly(data: CreateWeeklyInput!): DiaryAndWeekly!
    updateWeekly(id: String!, data: UpdateWeeklyInput!): DiaryAndWeekly!
    deleteWeekly(id: String!): Boolean!
  }

  type User {
    id: String!
    discord_id: String!
    username: String!
    avatar: String!
    diaries: [DiaryAndWeekly!]!
    weeklies: [DiaryAndWeekly!]!
    createdAt: String!
    updatedAt: String!
  }

  type DiaryAndWeekly {
    id: String!
    userId: String!
    title: String!
    description: String!
    isCompleted: Boolean!
    resetDay: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreateDiaryInput {
    userId: String!
    title: String!
    description: String!
    resetDay: String!
  }

  input UpdateDiaryInput {
    title: String
    description: String
    resetDay: String
    isCompleted: Boolean
  }

  input CreateWeeklyInput {
    userId: String!
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
