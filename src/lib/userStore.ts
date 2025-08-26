// Shared user store - remplacez par votre vraie base de données
export interface User {
  id: string
  name: string
  email: string
  password: string
  userType: "client" | "freelancer"
  createdAt: string
  emailVerified: boolean
  image?: string
}

// In-memory storage (remplacez par une vraie base de données)
const users: User[] = []

export const userStore = {
  // Ajouter un utilisateur
  addUser: (user: User) => {
    users.push(user)
    return user
  },

  // Trouver un utilisateur par email
  findUserByEmail: (email: string) => {
    return users.find(user => user.email === email)
  },

  // Trouver un utilisateur par ID
  findUserById: (id: string) => {
    return users.find(user => user.id === id)
  },

  // Obtenir tous les utilisateurs (pour debug)
  getAllUsers: () => {
    return users
  },

  // Vérifier si un utilisateur existe
  userExists: (email: string) => {
    return users.some(user => user.email === email)
  }
}
