using UnityEngine;

public class LocationMarkerSpawner : MonoBehaviour
{
    [SerializeField] private GameObject cuteGhostPrefab;
    private GameObject currentLocationGhost;
    private GameObject destinationGhost;

    public void SpawnAtCurrentLocation(Vector3 position)
    {
        if (currentLocationGhost != null)
            Destroy(currentLocationGhost);
            
        currentLocationGhost = Instantiate(cuteGhostPrefab, position, Quaternion.identity);
        currentLocationGhost.name = "CurrentLocationGhost";
    }

    public void SpawnAtDestination(Vector3 position)
    {
        if (destinationGhost != null)
            Destroy(destinationGhost);
            
        destinationGhost = Instantiate(cuteGhostPrefab, position, Quaternion.identity);
        destinationGhost.name = "DestinationGhost";
    }
}
