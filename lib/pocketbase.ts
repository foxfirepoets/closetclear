import PocketBase from 'pocketbase'

// Get the PocketBase URL from environment variables, defaulting to localhost
const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'

// Create and export the PocketBase client instance
export const pb = new PocketBase(PB_URL)

// Enable auto cancellation for duplicate requests
pb.autoCancellation(false)

// Authentication helper functions
export const auth = {
  // Login with email and password
  login: async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password)
      return { success: true, data: authData }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error }
    }
  },

  // Register new user
  register: async (userData: {
    name: string
    email: string
    password: string
    passwordConfirm: string
  }) => {
    try {
      const record = await pb.collection('users').create(userData)
      return { success: true, data: record }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error }
    }
  },

  // Logout current user
  logout: () => {
    pb.authStore.clear()
  },

  // Get current user
  getCurrentUser: () => {
    return pb.authStore.model
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return pb.authStore.isValid
  },

  // Refresh authentication
  refresh: async () => {
    try {
      if (pb.authStore.isValid) {
        await pb.collection('users').authRefresh()
        return { success: true }
      }
      return { success: false, error: 'Not authenticated' }
    } catch (error) {
      console.error('Auth refresh error:', error)
      pb.authStore.clear()
      return { success: false, error }
    }
  }
}

// Collection helper functions
export const collections = {
  // Clothing items collection helpers
  clothingItems: {
    // Create new clothing item
    create: async (itemData: any) => {
      try {
        const record = await pb.collection('clothing_items').create(itemData)
        return { success: true, data: record }
      } catch (error) {
        console.error('Create clothing item error:', error)
        return { success: false, error }
      }
    },

    // Get clothing items for current user
    getUserItems: async (page = 1, perPage = 20, filter = '', sort = '-created') => {
      try {
        const userId = pb.authStore.model?.id
        if (!userId) throw new Error('User not authenticated')

        const userFilter = `user = "${userId}"`
        const fullFilter = filter ? `${userFilter} && ${filter}` : userFilter

        const records = await pb.collection('clothing_items').getList(page, perPage, {
          sort,
          filter: fullFilter,
        })
        return { success: true, data: records }
      } catch (error) {
        console.error('Get clothing items error:', error)
        return { success: false, error }
      }
    },

    // Update clothing item
    update: async (id: string, itemData: any) => {
      try {
        const record = await pb.collection('clothing_items').update(id, itemData)
        return { success: true, data: record }
      } catch (error) {
        console.error('Update clothing item error:', error)
        return { success: false, error }
      }
    },

    // Delete clothing item
    delete: async (id: string) => {
      try {
        await pb.collection('clothing_items').delete(id)
        return { success: true }
      } catch (error) {
        console.error('Delete clothing item error:', error)
        return { success: false, error }
      }
    },

    // Get single clothing item
    getOne: async (id: string) => {
      try {
        const record = await pb.collection('clothing_items').getOne(id)
        return { success: true, data: record }
      } catch (error) {
        console.error('Get clothing item error:', error)
        return { success: false, error }
      }
    },

    // Increment wear count
    incrementWearCount: async (id: string) => {
      try {
        const item = await pb.collection('clothing_items').getOne(id)
        const newWearCount = (item.wear_count || 0) + 1
        const record = await pb.collection('clothing_items').update(id, {
          wear_count: newWearCount,
          last_worn: new Date().toISOString()
        })
        return { success: true, data: record }
      } catch (error) {
        console.error('Increment wear count error:', error)
        return { success: false, error }
      }
    }
  },

  // Outfits collection helpers
  outfits: {
    // Create new outfit
    create: async (outfitData: any) => {
      try {
        const record = await pb.collection('outfits').create(outfitData)
        return { success: true, data: record }
      } catch (error) {
        console.error('Create outfit error:', error)
        return { success: false, error }
      }
    },

    // Get outfits for current user
    getUserOutfits: async (page = 1, perPage = 20, sort = '-created') => {
      try {
        const userId = pb.authStore.model?.id
        if (!userId) throw new Error('User not authenticated')

        const records = await pb.collection('outfits').getList(page, perPage, {
          sort,
          filter: `user = "${userId}"`,
          expand: 'clothing_items'
        })
        return { success: true, data: records }
      } catch (error) {
        console.error('Get outfits error:', error)
        return { success: false, error }
      }
    }
  }
}

// Utility functions
export const utils = {
  // Get file URL for images
  getFileUrl: (record: any, filename: string, thumb = '100x100') => {
    if (!record || !filename) return ''

    try {
      return pb.files.getUrl(record, filename, { thumb })
    } catch (error) {
      console.error('Get file URL error:', error)
      return ''
    }
  },

  // Format date
  formatDate: (dateString: string, options: Intl.DateTimeFormatOptions = {}) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options
      })
    } catch (error) {
      console.error('Format date error:', error)
      return dateString
    }
  },

  // Format currency
  formatCurrency: (amount: number, currency = 'USD') => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
      }).format(amount)
    } catch (error) {
      console.error('Format currency error:', error)
      return amount.toString()
    }
  }
}

// Real-time subscription helpers
export const realtime = {
  // Subscribe to clothing items changes
  subscribeToClothingItems: (callback: (data: any) => void) => {
    const userId = pb.authStore.model?.id
    if (!userId) return null

    return pb.collection('clothing_items').subscribe('*', (e) => {
      // Only process records for the current user
      if (e.record?.user === userId) {
        callback(e)
      }
    }, {
      filter: `user = "${userId}"`
    })
  },

  // Subscribe to outfits changes
  subscribeToOutfits: (callback: (data: any) => void) => {
    const userId = pb.authStore.model?.id
    if (!userId) return null

    return pb.collection('outfits').subscribe('*', (e) => {
      // Only process records for the current user
      if (e.record?.user === userId) {
        callback(e)
      }
    }, {
      filter: `user = "${userId}"`
    })
  },

  // Unsubscribe from all subscriptions
  unsubscribeAll: () => {
    pb.realtime.unsubscribe()
  }
}

export default pb