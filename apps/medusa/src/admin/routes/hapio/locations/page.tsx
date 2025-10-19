import { defineRouteConfig } from "@medusajs/admin-sdk"
import { 
  Container, 
  Heading, 
  Button, 
  Table,
  StatusBadge,
  Text,
  Badge,
  Drawer,
  Input,
  Label,
  Select,
  toast
} from "@medusajs/ui"
import { useState, useEffect } from "react"
import { MapPin, Plus, PencilSquare, Trash, ArrowLeft } from "@medusajs/icons"

interface Location {
  id: string
  name: string
  time_zone: string
  resource_selection_strategy: "randomize" | "prioritize" | "equalize"
  resource_selection_priority: string[]
  metadata: Record<string, any> | null
  enabled: boolean
  created_at: string
  updated_at: string
}

interface LocationFormData {
  name: string
  time_zone: string
  resource_selection_strategy: "randomize" | "prioritize" | "equalize"
  metadata: Record<string, any>
  enabled: boolean
}

const LocationManagementPage = () => {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState<LocationFormData>({
    name: "",
    time_zone: "America/New_York",
    resource_selection_strategy: "randomize",
    metadata: {},
    enabled: true
  })

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/admin/hapio/locations')
      if (response.ok) {
        const data = await response.json()
        setLocations(data.locations || [])
      } else {
        console.error('Failed to fetch locations')
        toast.error('Failed to fetch locations')
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
      toast.error('Error fetching locations')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      // Prepare the data to send
      const dataToSend = {
        ...formData,
        // Send null for metadata if it's empty
        metadata: Object.keys(formData.metadata).length > 0 ? formData.metadata : null
      }
      
      console.log('Sending location data:', dataToSend)
      
      const response = await fetch('/admin/hapio/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        toast.success('Location created successfully')
        setCreateDrawerOpen(false)
        resetForm()
        fetchLocations()
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        
        // Show detailed error message
        if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ')
          toast.error(`Validation errors: ${errorMessages}`)
        } else {
          toast.error(errorData.message || 'Failed to create location')
        }
      }
    } catch (error) {
      console.error('Error creating location:', error)
      toast.error(`Error creating location: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleUpdate = async () => {
    if (!editingLocation) return

    try {
      const response = await fetch(`/admin/hapio/locations/${editingLocation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Location updated successfully')
        setEditDrawerOpen(false)
        setEditingLocation(null)
        resetForm()
        fetchLocations()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to update location')
      }
    } catch (error) {
      console.error('Error updating location:', error)
      toast.error('Error updating location')
    }
  }

  const handleDelete = async (location: Location) => {
    if (!confirm(`Are you sure you want to delete "${location.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/admin/hapio/locations/${location.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Location deleted successfully')
        fetchLocations()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to delete location')
      }
    } catch (error) {
      console.error('Error deleting location:', error)
      toast.error('Error deleting location')
    }
  }

  const openEditDrawer = (location: Location) => {
    setEditingLocation(location)
    setFormData({
      name: location.name,
      time_zone: location.time_zone,
      resource_selection_strategy: location.resource_selection_strategy,
      metadata: location.metadata || {},
      enabled: location.enabled
    })
    setEditDrawerOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      time_zone: "America/New_York",
      resource_selection_strategy: "randomize",
      metadata: {},
      enabled: true
    })
  }

  const getStatusBadge = (enabled: boolean) => {
    return enabled ? (
      <StatusBadge color="green">Enabled</StatusBadge>
    ) : (
      <StatusBadge color="red">Disabled</StatusBadge>
    )
  }

  const getStrategyBadge = (strategy: string) => {
    const colors = {
      randomize: "blue",
      prioritize: "orange", 
      equalize: "green"
    } as const
    
    return (
      <Badge variant="outline" className={`bg-${colors[strategy as keyof typeof colors]}-50`}>
        {strategy}
      </Badge>
    )
  }

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => window.location.href = '/app/hapio'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hapio
          </Button>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <Heading level="h2">Hapio Locations</Heading>
            <Text className="text-ui-fg-subtle" size="small">
              Manage booking locations for your services
            </Text>
          </div>
        </div>
        <Button onClick={() => setCreateDrawerOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Locations Table */}
      <div className="border border-ui-border-base rounded-lg overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Time Zone</Table.HeaderCell>
              <Table.HeaderCell>Strategy</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell colSpan={6} className="text-center py-8">
                  <Text>Loading locations...</Text>
                </Table.Cell>
              </Table.Row>
            ) : locations.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={6} className="text-center py-8">
                  <Text>No locations found</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              locations.map((location) => (
                <Table.Row key={location.id}>
                  <Table.Cell>
                    <Text className="font-medium">{location.name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-sm">{location.time_zone}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    {getStrategyBadge(location.resource_selection_strategy)}
                  </Table.Cell>
                  <Table.Cell>
                    {getStatusBadge(location.enabled)}
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-sm">
                      {new Date(location.created_at).toLocaleDateString()}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => openEditDrawer(location)}
                      >
                        <PencilSquare className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => handleDelete(location)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Create Location Drawer */}
      <Drawer open={createDrawerOpen} onOpenChange={setCreateDrawerOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Create New Location</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="space-y-4">
            <div>
              <Label htmlFor="name">Location Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter location name"
              />
            </div>

            <div>
              <Label htmlFor="time_zone">Time Zone *</Label>
              <Select 
                value={formData.time_zone}
                onValueChange={(value) => setFormData({ ...formData, time_zone: value })}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="America/New_York">America/New_York</Select.Item>
                  <Select.Item value="America/Los_Angeles">America/Los_Angeles</Select.Item>
                  <Select.Item value="America/Chicago">America/Chicago</Select.Item>
                  <Select.Item value="Europe/London">Europe/London</Select.Item>
                  <Select.Item value="Europe/Paris">Europe/Paris</Select.Item>
                  <Select.Item value="Asia/Tokyo">Asia/Tokyo</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div>
              <Label htmlFor="strategy">Resource Selection Strategy</Label>
              <Select 
                value={formData.resource_selection_strategy}
                onValueChange={(value: "randomize" | "prioritize" | "equalize") => 
                  setFormData({ ...formData, resource_selection_strategy: value })
                }
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="randomize">Randomize</Select.Item>
                  <Select.Item value="prioritize">Prioritize</Select.Item>
                  <Select.Item value="equalize">Equalize</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              />
              <Label htmlFor="enabled">Enabled</Label>
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setCreateDrawerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                Create Location
              </Button>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>

      {/* Edit Location Drawer */}
      <Drawer open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edit Location</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Location Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter location name"
              />
            </div>

            <div>
              <Label htmlFor="edit-time_zone">Time Zone *</Label>
              <Select 
                value={formData.time_zone}
                onValueChange={(value) => setFormData({ ...formData, time_zone: value })}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="America/New_York">America/New_York</Select.Item>
                  <Select.Item value="America/Los_Angeles">America/Los_Angeles</Select.Item>
                  <Select.Item value="America/Chicago">America/Chicago</Select.Item>
                  <Select.Item value="Europe/London">Europe/London</Select.Item>
                  <Select.Item value="Europe/Paris">Europe/Paris</Select.Item>
                  <Select.Item value="Asia/Tokyo">Asia/Tokyo</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-strategy">Resource Selection Strategy</Label>
              <Select 
                value={formData.resource_selection_strategy}
                onValueChange={(value: "randomize" | "prioritize" | "equalize") => 
                  setFormData({ ...formData, resource_selection_strategy: value })
                }
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="randomize">Randomize</Select.Item>
                  <Select.Item value="prioritize">Prioritize</Select.Item>
                  <Select.Item value="equalize">Equalize</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              />
              <Label htmlFor="edit-enabled">Enabled</Label>
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditDrawerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update Location
              </Button>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Hapio Locations",
})

export default LocationManagementPage