import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { geonames } from '../config/geonames'

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
  const { amount, item } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, setValue, watch } = useForm<ContributeForm>()
  const selectedItemCount = watch('itemCount')
  const [countries, setCountries] = useState<Location[]>([])
  const [states, setStates] = useState<Location[]>([])
  const [cities, setCities] = useState<Location[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Location | null>(null)
  const [selectedState, setSelectedState] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    if (amount) {
      setValue('amount', parseInt(amount))
    }
  }, [amount, setValue])

  const sponsorItems = [
    { name: "TV", price: 35000, available: 2 },
    { name: "Bench & Desk", price: 15000, available: 10 },
    { name: "Table & Chair", price: 8000, available: 5 },
    { name: "Podium", price: 5000, available: 1 },
    { name: "Shelf", price: 12000, available: 4 },
    { name: "Door", price: 8000, available: 6 },
    { name: "Window", price: 6000, available: 8 },
    { name: "Wiring", price: 20000, available: 1 },
    { name: "Painting", price: 10000, available: 1 }
  ]

  const selectedItem = item ? sponsorItems.find(i => i.name.toLowerCase() === item.toLowerCase()) : null

  useEffect(() => {
    if (selectedItem) {
      setValue('amount', selectedItem.price)
    }
  }, [selectedItem, setValue])

  const handlePayment = (data: ContributeForm) => {
      navigate('/payment', {
        state: {
          amount: data.amount,
          name: data.name,
          hideMyName: data.hideMyName,
          mobile: data.mobile,
          country: data.country,
          state: data.state,
          city: data.city,
          ward: data.ward,
          itemCount: selectedItemCount
        }
      })
      window.scrollTo(0, 0)
      setValue('amount', 0)
      setValue('name', '')
      setValue('hideMyName', false)
      setValue('mobile', '')
      setValue('country', '')
      setValue('state', '')
      setValue('city', '')
      setValue('ward', '')
  };

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
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Donation Amount (₹)
            </label>
            <input
              type="number"
              {...register('amount', { required: true })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
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
            {...register('mobile', { required: true })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
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
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country.geonameId} value={country.geonameId}>
                  {country.name}
                </option>
              ))}
            </select>
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
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state.geonameId} value={state.geonameId}>
                  {state.name}
                </option>
              ))}
            </select>
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
            >
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city.geonameId} value={city.geonameId}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pincode
            </label>
            <input
              type="text"
              {...register('ward')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter Pincode Number"
            />
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
          disabled={loading}
        >
          {selectedItem ? (
            <>
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>Connect on WhatsApp</span>
            </>
          ) : (
            <span>Proceed to Payment</span>
          )}
        </button>
      </form>
    </div>
  )
}

export default Contribute