using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;
using System;
#if PLATFORM_ANDROID
using UnityEngine.Android;
#endif

public class GPSMapbox : MonoBehaviour
{
    public string accessToken;
    public float centerLatitude = 36.1516f; // Example latitude (Tulsa)
    public float centerLongitude = -95.9928f; // Example longitude (Tulsa)  
    public float zoom = 15f; // Example zoom level
    public int bearing = 0; // Example bearing
    public int pitch = 0; // Example pitch
    public enum style { Light, Dark, Streets, Outdoors, Satellite, SatelliteStreets };
    public style mapStyle = style.Streets; // Example map style
    public enum resolution { low = 1, high = 2 };
    public resolution mapResolution = resolution.high; // Example map resolution

    private int mapWidth = Screen.width;
    private int mapHeight = Screen.height;
    private string[] styleStr = new string[] { "light-v10", "dark-v10", "streets-v11", "outdoors-v11", "satellite-v9", "satellite-streets-v11" };
    private string url = "";
    private bool mapIsLoading = false;
    private Rect rect;
    private bool updateMap = true;

    private string accessTokenLast;
    private float centerLatitudeLast = 36.1516f; // Example latitude (Tulsa)
    private float centerLongitudeLast = -95.9928f; // Example longitude (Tulsa)
    private float zoomLast = 12.0f;
    private int bearingLast = 0;
    private int pitchLast = 0;
    private style mapStyleLast = style.Streets;
    private resolution mapResolutionLast = resolution.high;

    private GameObject currentLocationMarker;
    private bool isTrackingLocation = false;


    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        // Ask for location permissions from user on Android devices
        #if PLATFORM_ANDROID
        if (!Permission.HasUserAuthorizedPermission(Permission.FineLocation))
        {
            Permission.RequestUserPermission(Permission.FineLocation);
        }
        #endif

        StartCoroutine(GetMapbox());
        rect = gameObject.GetComponent<RawImage>().rectTransform.rect;
        mapWidth = (int)Math.Round(rect.width);
        mapHeight = (int)Math.Round(rect.height);
    }

    // Update is called once per frame
    void Update()
    {
        if (updateMap && (accessToken != accessTokenLast || !Mathf.Approximately(centerLatitudeLast, centerLatitude) || !Mathf.Approximately(centerLongitudeLast, centerLongitude) || zoomLast != zoom || bearingLast != bearing || pitchLast != pitch || mapStyleLast != mapStyle || mapResolutionLast != mapResolution))
        {
            rect = gameObject.GetComponent<RawImage>().rectTransform.rect;
            mapWidth = (int)Math.Round(rect.width);
            mapHeight = (int)Math.Round(rect.height);
            StartCoroutine(GetMapbox());
            updateMap = false;
        }
    }


    IEnumerator GetMapbox()
    {
        url = "https://api.mapbox.com/styles/v1/mapbox/" + styleStr[(int)mapStyle] + "/static/" + centerLongitude + "," + centerLatitude + "," + zoom + "," + bearing + "," +  pitch + "/" + mapWidth + "x" + mapHeight + "?" + "access_token=" + accessToken;
        mapIsLoading = true;
        UnityWebRequest www = UnityWebRequestTexture.GetTexture(url);
        yield return www.SendWebRequest();
        if (www.result != UnityWebRequest.Result.Success)
        {
            Debug.Log("WWW ERROR: " + www.error);
        }
        else
        {
            mapIsLoading = false;
            gameObject.GetComponent<RawImage>().texture = ((DownloadHandlerTexture)www.downloadHandler).texture;

            accessTokenLast = accessToken;
            centerLatitudeLast = centerLatitude;
            centerLongitudeLast = centerLongitude;
            zoomLast = zoom;
            bearingLast = bearing;
            pitchLast = pitch;
            mapStyleLast = mapStyle;
            mapResolutionLast = mapResolution;
            updateMap = true;
        }
    }
}