using UnityEngine;
using TMPro;
#if PLATFORM_ANDROID
using UnityEngine.Android;
#endif

public class GPSManager : MonoBehaviour
{
    [Header("UI References")]
    [SerializeField] private TMP_Text latitudeText;
    [SerializeField] private TMP_Text longitudeText;
    [SerializeField] private TMP_Text altitudeText;
    [SerializeField] private TMP_Text distanceText;
    [SerializeField] private TMP_Text statusText;
    [Header("Marker References")]
    [SerializeField] private GameObject cuteGhostPrefab;
    private GameObject currentLocationMarker;
    private GameObject destinationMarker;

    private Vector3 storedLocation;
    private bool isTrackingLocation = false;
    private float updateInterval = 0.5f;
    private float nextUpdateTime;

    [Header("Audio")]
    [SerializeField] private AudioSource audioSource;
    [SerializeField] private AudioClip backgroundMusic;
      void Start()
      {
          #if PLATFORM_ANDROID
          if (!Permission.HasUserAuthorizedPermission(Permission.FineLocation))
          {
              Permission.RequestUserPermission(Permission.FineLocation);
          }
          #endif

          audioSource = gameObject.AddComponent<AudioSource>();
          audioSource.clip = backgroundMusic;
          audioSource.loop = true;
          audioSource.Play();

          InitializeLocationServices();
      }
    private void InitializeLocationServices()
    {
        if (!Input.location.isEnabledByUser)
        {
            statusText.text = "Location services not enabled";
            return;
        }

        Input.location.Start(1f, 0.1f);
        Input.compass.enabled = true;
        isTrackingLocation = true;
        statusText.text = "Initializing location services...";
    }

    void Update()
    {
        if (!isTrackingLocation) return;

        if (Time.time > nextUpdateTime)
        {
            nextUpdateTime = Time.time + updateInterval;
            UpdateLocationDisplay();
        }
    }

    private void UpdateLocationDisplay()
    {
        switch (Input.location.status)
        {
            case LocationServiceStatus.Running:
                var currentData = Input.location.lastData;
                latitudeText.text = $"Latitude: {currentData.latitude:F6}°";
                longitudeText.text = $"Longitude: {currentData.longitude:F6}°";
                altitudeText.text = $"Altitude: {currentData.altitude:F1}m";
                statusText.text = "Location tracking active";

                Vector3 currentLocation = new Vector3(currentData.latitude, currentData.altitude, currentData.longitude);
                Vector3 worldPosition = ConvertGPSToWorldPosition(currentLocation);
                UpdateCurrentLocationMarker(worldPosition);
                break;

            case LocationServiceStatus.Failed:
                statusText.text = "Location services failed";
                break;

            case LocationServiceStatus.Initializing:
                statusText.text = "Initializing location services...";
                break;
        }
    }

    private Vector3 ConvertGPSToWorldPosition(Vector3 targetGPS)
    {
        Vector3 originGPS = new Vector3(
            Input.location.lastData.latitude,
            0,
            Input.location.lastData.longitude
        );

        float latDiff = (targetGPS.x - originGPS.x);
        float lonDiff = (targetGPS.z - originGPS.z);

        float latUnity = latDiff * 111000f;
        float lonUnity = lonDiff * 111000f * Mathf.Cos(originGPS.x * Mathf.Deg2Rad);

        return new Vector3(latUnity, 0, lonUnity);
    }

    private void UpdateCurrentLocationMarker(Vector3 position)
    {
        if (currentLocationMarker == null)
        {
            currentLocationMarker = Instantiate(cuteGhostPrefab, position, Quaternion.identity);
            currentLocationMarker.name = "CurrentLocationGhost";
        }
        else
        {
            currentLocationMarker.transform.position = position;
        }
    }

    public void StoreCurrentLocation()
    {
        if (Input.location.status != LocationServiceStatus.Running) return;

        storedLocation = new Vector3(
            Input.location.lastData.latitude,
            Input.location.lastData.altitude,
            Input.location.lastData.longitude
        );

        Vector3 worldPosition = ConvertGPSToWorldPosition(storedLocation);
        
        if (destinationMarker == null)
        {
            destinationMarker = Instantiate(cuteGhostPrefab, worldPosition, Quaternion.identity);
            destinationMarker.name = "DestinationGhost";
        }
        else
        {
            destinationMarker.transform.position = worldPosition;
        }

        statusText.text = "Location stored successfully";
    }

    public void CalculateDistance()
    {
        if (Input.location.status != LocationServiceStatus.Running) return;

        Vector3 currentLocation = new Vector3(
            Input.location.lastData.latitude,
            Input.location.lastData.altitude,
            Input.location.lastData.longitude
        );

        float distance = CalculateGPSDistance(
            storedLocation.x, storedLocation.z,
            currentLocation.x, currentLocation.z
        );

        distanceText.text = $"Distance: {distance:F2} meters";
    }

    private float CalculateGPSDistance(float lat1, float lon1, float lat2, float lon2)
    {
        const float EarthRadius = 6371000;
        float lat1Rad = lat1 * Mathf.Deg2Rad;
        float lat2Rad = lat2 * Mathf.Deg2Rad;
        float deltaLat = (lat2 - lat1) * Mathf.Deg2Rad;
        float deltaLon = (lon2 - lon1) * Mathf.Deg2Rad;

        float a = Mathf.Sin(deltaLat / 2) * Mathf.Sin(deltaLat / 2) +
                 Mathf.Cos(lat1Rad) * Mathf.Cos(lat2Rad) *
                 Mathf.Sin(deltaLon / 2) * Mathf.Sin(deltaLon / 2);

        float c = 2 * Mathf.Atan2(Mathf.Sqrt(a), Mathf.Sqrt(1 - a));
        return EarthRadius * c;
    }

    void OnDisable()
    {
        if (Input.location.isEnabledByUser)
        {
            Input.location.Stop();
            Input.compass.enabled = false;
        }
    }
}