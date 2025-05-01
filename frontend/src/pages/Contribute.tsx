import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { geonames } from '../config/geonames'
import { useSponsorItems, useSponsorItem, useAddDonation, useDeviceId } from '../hooks'
import { DonationStatus } from '../types/graphql.type' // Fix the import path

interface Location {
  geonameId: number
  name: string
  countryCode?: string
  countryName?: string
}

interface ContributeForm {
  amount: number
  name: string
  hideMyName: boolean
  mobile: string
  country: string
  state: string
  city: string
  ward: string
  itemCount?: number
}

function Contribute() {
  const { amount, sponsor: sponsorId } = useParams(); // Fixed parameter name
  const navigate = useNavigate()
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ContributeForm>()
  const selectedItemCount = watch('itemCount') || 1
  const deviceId = useDeviceId()
  
  // States for location dropdowns
  const [countries, setCountries] = useState<Location[]>([])
  const [states, setStates] = useState<Location[]>([])
  const [cities, setCities] = useState<Location[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Location | null>(null)
  const [selectedState, setSelectedState] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Get all sponsor items
  const { data: sponsorItemsData, loading: sponsorItemsLoading } = useSponsorItems()
  
  // Get specific sponsor item if ID is provided
  const { data: sponsorItemData, loading: sponsorItemLoading } = useSponsorItem(sponsorId)
  
  // Add donation mutation
  const [addDonation, { loading: addingDonation }] = useAddDonation(
    (data) => {
      setIsSubmitting(false)
      navigate('/payment-success', { 
        state: { 
          donationId: data.addDonation.id,
          amount: data.addDonation.amount
        } 
      })
      window.scrollTo(0, 0)
    },
    (error) => {
      setIsSubmitting(false)
      setError(error.message || 'Failed to submit donation. Please try again.')
      window.scrollTo(0, 0)
    }
  )

  // Fetch countries on component mount
  useEffect(() => {
    setLoading(true)
    setError(null)
    geonames.countryInfo({})
      .then(response => {
        setCountries(response.geonames.map((country: any) => ({
          geonameId: country.geonameId,
          name: country.countryName,
          countryCode: country.countryCode
        })))
      })
      .catch(error => {
        console.error('Error fetching countries:', error)
        setError('Failed to load countries. Please try again later.')
      })
      .finally(() => setLoading(false))
  }, [])

  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      setLoading(true)
      setError(null)
      geonames.children({ geonameId: selectedCountry.geonameId })
        .then(response => {
          setStates(response.geonames.map((state: any) => ({
            geonameId: state.geonameId,
            name: state.name
          })))
          setSelectedState(null)
          setCities([])
        })
        .catch(error => {
          console.error('Error fetching states:', error)
          setError('Failed to load states. Please try again later.')
        })
        .finally(() => setLoading(false))
    }
  }, [selectedCountry])

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedState) {
      setLoading(true)
      setError(null)
      geonames.children({ geonameId: selectedState.geonameId })
        .then(response => {
          setCities(response.geonames.map((city: any) => ({
            geonameId: city.geonameId,
            name: city.name
          })))
        })
        .catch(error => {
          console.error('Error fetching cities:', error)
          setError('Failed to load cities. Please try again later.')
        })
        .finally(() => setLoading(false))
    }
  }, [selectedState])

  // Set amount from URL param
  useEffect(() => {
    if (amount) {
      setValue('amount', parseInt(amount))
    }
  }, [amount, setValue])

  // Transform sponsor items from backend
  const sponsorItems = sponsorItemsLoading || !sponsorItemsData || !('getAllSponsorItems' in sponsorItemsData) ? [] : 
    sponsorItemsData.getAllSponsorItems.map(item => ({
      id: item.id,
      name: item.itemName,
      price: item.price,
      available: item.count - item.sponsoredCount
    }))

  // Selected item from backend data
  const selectedItem = !sponsorItemLoading && sponsorItemData?.getSponsorItemById ? {
    id: sponsorItemData.getSponsorItemById.id ?? '',
    name: sponsorItemData.getSponsorItemById.itemName ?? 'Unknown Item',
    price: sponsorItemData.getSponsorItemById.price ?? 0,
    available: (sponsorItemData.getSponsorItemById.count ?? 0) - (sponsorItemData.getSponsorItemById.sponsoredCount ?? 0)
  } : null;

  // Set amount based on selected item and count
  useEffect(() => {
    if (selectedItem) {
      setValue('amount', selectedItem.price * (parseInt(selectedItemCount.toString()) || 1))
    }
  }, [selectedItem, selectedItemCount, setValue])

  const handlePayment = async (data: ContributeForm) => {
    if (!deviceId) {
      setError("Unable to identify device. Please try refreshing the page.")
      return
    }
    
    setIsSubmitting(true)
    
    // Submit to backend using the addDonation mutation
    addDonation({
      variables: {
        data: {
          deviceId,
          name: data.hideMyName ? 'Anonymous' : data.name || 'Anonymous',
          phoneNumber: data.mobile,
          amount: data.amount,
          countryName: data.country,
          stateName: data.state,
          cityName: data.city,
          pincode: data.ward,
          status: DonationStatus.DRAFT
        }
      }
    })
  }

  const handleWhatsAppConnect = (data: ContributeForm) => {
    const message = `Hello, I'm interested in sponsoring for Smart Class!\n\n` +
      `Details:\n` +
      `${selectedItem ? `Item: ${selectedItem.name}\n` : ''}` +
      `${selectedItem ? `Units: ${data.itemCount}\n` : ''}` +
      `Amount: ₹${data.amount}\n` +
      `Name: ${data.hideMyName ? 'Anonymous' : data.name || 'Not provided'}\n` +
      `Mobile: ${data.mobile}\n` +
      `Location: ${data.city}, ${data.state}, ${data.country}\n` +
      `Pincode: ${data.ward}\n\n` +
      `Please contact me regarding this sponsorship.`;

    const encodedMessage = encodeURIComponent(message);
    window.location.href = `https://wa.me/919446152129?text=${encodedMessage}`;
  };

  if (loading && !countries.length) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if ((sponsorItemsLoading && !sponsorId) || (sponsorItemLoading && sponsorId)) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading sponsor items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        {selectedItem ? `Sponsor ${selectedItem.name}` : 'Make a Contribution'}
      </h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(selectedItem ? handleWhatsAppConnect : handlePayment)} className="space-y-6">
        {selectedItem ? (
          <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Sponsorship Details</h3>
            <p className="text-gray-600 dark:text-gray-300">Item: {selectedItem.name}</p>
            <p className="text-gray-600 dark:text-gray-300">Price per unit: ₹{selectedItem.price.toLocaleString()}</p>
            <p className="text-gray-600 dark:text-gray-300">Available units: {selectedItem.available}</p>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of units to sponsor
              </label>
              <input
                type="number"
                min="1"
                max={selectedItem.available}
                {...register('itemCount', {
                  min: 1,
                  max: selectedItem?.available || 0,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
                    setValue('amount', selectedItem?.price * parseInt(e.target.value) || 0)
                })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                defaultValue="1"
              />
              {errors.itemCount && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.itemCount.type === "min" ? "Minimum 1 unit required" : 
                   errors.itemCount.type === "max" ? `Maximum ${selectedItem.available} units available` : 
                   "Invalid input"}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Donation Amount (₹)
            </label>
            <input
              type="number"
              {...register('amount', { 
                required: "Amount is required",
                min: { value: 1, message: "Amount must be greater than 0" }
              })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.amount && (
              <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
            )}
          </div>
        )}

        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name (Optional)
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center md:self-end md:pb-2">
            <input
              type="checkbox"
              {...register('hideMyName')}
              className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Hide my name
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mobile Number
          </label>
          <input
            type="tel"
            {...register('mobile', { 
              required: "Mobile number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit mobile number"
              }
            })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.mobile && (
            <p className="text-sm text-red-600 mt-1">{errors.mobile.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Country
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              onChange={(e) => {
                const country = countries.find(c => c.geonameId === parseInt(e.target.value))
                setSelectedCountry(country || null)
                setValue('country', country?.name || '')
              }}
              disabled={loading}
              {...register('country', { required: "Country is required" })}
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country.geonameId} value={country.geonameId}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-sm text-red-600 mt-1">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              State
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              onChange={(e) => {
                const state = states.find(s => s.geonameId === parseInt(e.target.value))
                setSelectedState(state || null)
                setValue('state', state?.name || '')
              }}
              disabled={!selectedCountry || loading}
              {...register('state', { required: "State is required" })}
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state.geonameId} value={state.geonameId}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              City
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              onChange={(e) => {
                const city = cities.find(c => c.geonameId === parseInt(e.target.value))
                setValue('city', city?.name || '')
              }}
              disabled={!selectedState || loading}
              {...register('city', { required: "City is required" })}
            >
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city.geonameId} value={city.geonameId}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pincode
            </label>
            <input
              type="text"
              {...register('ward', { 
                required: "Pincode is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Please enter a valid 6-digit pincode"
                }
              })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter Pincode"
            />
            {errors.ward && (
              <p className="text-sm text-red-600 mt-1">{errors.ward.message}</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Total Amount</h3>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            ₹{watch('amount')?.toLocaleString() || '0'}
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center space-x-2"
          disabled={loading || isSubmitting || addingDonation}
        >
          {selectedItem ? (
            <>
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>
                {isSubmitting ? 'Connecting...' : 'Connect on WhatsApp'}
              </span>
            </>
          ) : (
            <span>
              {isSubmitting || addingDonation ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Proceed to Payment'}
            </span>
          )}
        </button>
      </form>
    </div>
  )
}

export default Contribute