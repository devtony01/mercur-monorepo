import { useState } from "react"
import {
  Button,
  Input,
  Label,
  Textarea,
  Select,
  toast,
  Drawer,
  Heading,
  Text,
} from "@medusajs/ui"
import { Plus } from "@medusajs/icons"

interface CreateServiceFormProps {
  onServiceCreated?: () => void
}

interface ServiceFormData {
  title: string
  description: string
  duration: string
  price: string
  currency: string
}

export const CreateServiceForm = ({ onServiceCreated }: CreateServiceFormProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    duration: "60",
    price: "100.00",
    currency: "usd"
  })

  const handleInputChange = (field: keyof ServiceFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Service title is required")
      return false
    }
    if (!formData.description.trim()) {
      toast.error("Service description is required")
      return false
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const priceInCents = Math.round(parseFloat(formData.price) * 100)
      
      // Try custom API route first, fallback to standard product creation
      let response
      try {
        response = await fetch('/admin/hapio/create-service', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            price: priceInCents,
            duration: formData.duration
          }),
        })
      } catch (customApiError) {
        console.log('Custom API not available, using standard product creation')
        
        // Fallback to standard product creation
        response = await fetch('/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            subtitle: 'Bookable service product',
            description: formData.description,
            status: 'draft',
            metadata: {
              requires_booking: 'true',
              type: 'service',
              booking_duration: formData.duration,
              advance_booking_days: '30'
            },
            options: [
              {
                title: 'Duration',
                values: [`${formData.duration} min`]
              }
            ],
            variants: [
              {
                title: `${formData.title} (${formData.duration} min)`,
                options: {
                  'Duration': `${formData.duration} min`
                },
                prices: [
                  {
                    currency_code: formData.currency,
                    amount: priceInCents
                  }
                ],
                manage_inventory: false
              }
            ]
          }),
        })
      }

      if (response && response.ok) {
        const data = await response.json()
        const product = data.product || data
        
        toast.success("Service created successfully!")
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          duration: "60",
          price: "100.00",
          currency: "usd"
        })
        
        // Close drawer
        setIsOpen(false)
        
        // Notify parent component
        if (onServiceCreated) {
          onServiceCreated()
        }
        
        // Navigate to product edit page
        setTimeout(() => {
          if (product.id) {
            window.location.href = `/app/products/${product.id}`
          }
        }, 1000)
      } else {
        const errorData = await response?.json().catch(() => ({ message: 'Unknown error' }))
        toast.error(`Failed to create service: ${errorData?.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error creating service:", error)
      toast.error("Failed to create service. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Create Service
      </Button>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Create New Bookable Service</Drawer.Title>
            <Drawer.Description>
              Create a new service that customers can book appointments for
            </Drawer.Description>
          </Drawer.Header>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Service Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Hair Styling, Massage Therapy, Personal Training"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            {/* Service Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Service Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what this service includes, what customers can expect, and any special requirements..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Duration and Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select 
                  value={formData.duration} 
                  onValueChange={(value) => handleInputChange('duration', value)}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="15">15 minutes</Select.Item>
                    <Select.Item value="30">30 minutes</Select.Item>
                    <Select.Item value="45">45 minutes</Select.Item>
                    <Select.Item value="60">60 minutes</Select.Item>
                    <Select.Item value="90">90 minutes</Select.Item>
                    <Select.Item value="120">120 minutes</Select.Item>
                  </Select.Content>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ui-fg-subtle">$</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="100.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-ui-bg-subtle border border-ui-border-base rounded-lg">
              <Text className="text-sm text-ui-fg-subtle">
                <strong>Note:</strong> This will create a draft service product that customers can book appointments for. 
                You can further customize pricing, variants, and booking settings after creation.
              </Text>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? "Creating..." : "Create Service"}
              </Button>
            </div>
          </form>
        </Drawer.Content>
      </Drawer>
    </>
  )
}