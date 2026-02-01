# Zadarma: API interface

Source: https://zadarma.com/en/support/api/

API navigation

Back to top

* [Introduction](#intro)
  + [Library](#api_docs_library)
  + [Examples](#api_docs_examples)
  + [Features for work](#intro_functions)
  + [Authorization](#intro_authorization)
  + [Restrictions](#intro_restrictions)
* [Methods](#api)

  + [Info](#api_info)
  - [/info/balance/](#api_info_balance)
  - [/info/price/](#api_info_price)
  - [/info/timezone/](#api_info_timezone)
  - [/tariff/](#api_tariff)
  - [/request/callback/](#api_callback)
  - [/request/checknumber/](#api_request_checknumber)
  - [/info/number\_lookup/](#api_info_number_lookup)
  - [/info/lists/currencies/](#api_info_lists_currencies)
  - [/info/lists/languages/](#api_info_lists_languages)
  - [/info/lists/tariffs/](#api_info_lists_tariffs)+ [SIP](#api_sip)
  - [/sip/](#api_sip_method)
  - [/sip/<SIP>/status/](#api_sip_status)
  - [/sip/callerid/](#api_sip_callerid)
  - [/sip/redirection/](#api_sip_redirection_get)
  - [/sip/redirection/](#api_sip_redirection_put)
  - [/sip/redirection/](#api_sip_redirection_put2)
  - [/sip/create/](#api_sip_post_create)
  - [/sip/<SIP>/password/](#api_sip_internal_password)+ [Statistics](#api_statistics)
  - [/statistics/](#api_statistic)
  - [/statistics/pbx/](#api_statistics_pbx)
  - [/statistics/callback\_widget/](#api_statistics_callback_widget)
  - [/statistics/incoming-calls/](#api_statistics_incoming_calls)+ [PBX](#api_pbx)
  - [/pbx/redirection/](#api_pbx_redirection_post)
  - [/pbx/redirection/](#api_pbx_redirection_get)
  - [/pbx/record/request/](#api_pbx_record_request)
  - [/pbx/record/request/](#api_pbx_delete_record_request)
  - [/pbx/waitmelody/upload](#api_pbx_waitmelody_upload)
  - [/pbx/waitmelody/switch](#api_pbx_waitmelody_switch)
  - [/pbx/waitmelody/delete](#api_pbx_waitmelody_delete)
  - [/pbx/callinfo/](#api_pbx_get_callinfo)
  - [/pbx/callinfo/url/](#api_pbx_post_callinfo_url)
  - [/pbx/callinfo/notifications/](#api_pbx_post_callinfo_notifications)
  - [/pbx/callinfo/url/](#api_pbx_delete_callinfo_url)
  - [/pbx/create/](#api_pbx_post_create)
  - [/pbx/webhooks/](#api_pbx_get_webhooks)
  - [/pbx/webhooks/url/](#api_pbx_post_webhooks_url)
  - [/pbx/webhooks/hooks/](#api_pbx_post_webhooks_hooks)
  - [/pbx/webhooks/url/](#api_pbx_delete_webhooks_url)+ [PBX (extensions)](#api_pbx_internal_category)
  - [/pbx/internal/](#api_pbx_internal)
  - [/pbx/internal/<PBXSIP>/status/](#api_pbx_internal_status)
  - [/pbx/internal/<PBXSIP>/info/](#api_pbx_internal_info)
  - [/pbx/internal/recording/](#api_pbx_internal_recording)
  - [/pbx/internal/create/](#api_pbx_internal_create)
  - [/pbx/internal/<SIP>/password/](#api_pbx_internal_sip_password)
  - [/pbx/internal/<SIP>/password/](#api_pbx_internal_put_sip_password)
  - [/pbx/internal/<SIP>/edit/](#api_pbx_internal_edit)+ [PBX (IVR)](#api_pbx_ivr_category)
  - [/pbx/ivr/sounds/list](#api_pbx_ivr_sounds_list)
  - [/pbx/ivr/sounds/upload](#api_pbx_ivr_sounds_upload)
  - [/pbx/ivr/sounds/delete](#api_pbx_ivr_sounds_delete)
  - [/pbx/ivr/](#api_pbx_get_ivr)
  - [/pbx/ivr/create/](#api_pbx_post_ivr_create)
  - [/pbx/ivr/delete/](#api_pbx_ivr_delete)
  - [/pbx/ivr/scenario/](#api_pbx_get_ivr_scenario)
  - [/pbx/ivr/scenario/create/](#api_pbx_post_ivr_scenario_create)
  - [/pbx/ivr/scenario/edit/](#api_pbx_ivr_scenario_edit)
  - [/pbx/ivr/scenario/delete/](#api_pbx_ivr_scenario_delete)+ [Speech recognition](#api_method_speech_recognition)
  - [/speech\_recognition/](#api_get_speech_recognition)
  - [/speech\_recognition/](#api_put_speech_recognition)+ [Virtual numbers](#api_direct_numbers_group)
  - [/direct\_numbers/](#api_direct_numbers)
  - [/direct\_numbers/number/](#api_get_direct_numbers_numbers)
  - [/direct\_numbers/autoprolongation/](#api_get_direct_numbers_autoprolongation)
  - [/direct\_numbers/checking-wrongs/](#api_get_direct_numbers_checking_wrongs)
  - [/direct\_numbers/autoprolongation/](#api_put_direct_numbers_autoprolongation)
  - [/direct\_numbers/countries/](#api_get_direct_numbers_countries)
  - [/direct\_numbers/country/](#api_get_direct_numbers_country)
  - [/direct\_numbers/set\_caller\_name/](#api_put_direct_numbers_set_caller_name)
  - [/direct\_numbers/set\_sip\_id/](#api_put_direct_numbers_set_sip_id)
  - [/direct\_numbers/available/<DIRECTION\_ID>/](#api_direct_numbers_available)
  - [/direct\_numbers/order/](#api_direct_numbers_order)
  - [/direct\_numbers/prolong/](#api_direct_numbers_prolong)
  - [/direct\_numbers/receive\_sms/](#api_put_direct_numbers_receive_sms)
  - [/direct\_numbers/incoming\_channels/](#api_get_direct_numbers_incoming_channels)
  - [/direct\_numbers/incoming\_channels/](#api_put_direct_numbers_incoming_channels)+ [Groups of documents](#api_documents)
  - [/documents/files](#api_documents_get_files)
  - [/documents/groups/list/](#api_documents_get_groups_list)
  - [/documents/groups/get/<ID>/](#api_documents_groups_get_id)
  - [/documents/groups/valid/<ID>/](#api_documents_groups_valid_id)
  - [/documents/groups/create/](#api_documents_groups_create)
  - [/documents/groups/update/<GROUPID>/](#api_documents_groups_update_groupid)
  - [/documents/upload/](#api_documents_upload)+ [Reseller](#api_reseller)
  - [/reseller/account/info/](#api_reseller_get_account_info)
  - [/reseller/account/money\_transfer/](#api_reseller_account_money_transfer)
  - [/reseller/users/phones/](#api_reseller_get_users_phones)
  - [/reseller/users/phones/add/](#api_reseller_post_users_phones_add)
  - [/reseller/users/phones/update/](#api_reseller_post_users_phones_update)
  - [/reseller/users/phones/prove\_by\_sms](#api_reseller_post_users_phones_prove_by_sms)
  - [/reseller/users/phones/prove\_by\_callback](#api_reseller_users_phones_prove_by_callback)
  - [/reseller/users/phones/confirm](#api_reseller_post_users_phones_confirm)
  - [/reseller/users/registration/new/](#api_reseller_post_users_registration_new)
  - [/reseller/users/registration/confirm/](#api_reseller_post_users_registration_confirm)
  - [/reseller/users/list/](#api_reseller_get_users_list)
  - [/reseller/users/find/](#api_reseller_get_users_find)
  - [/reseller/users/topup/](#api_reseller_post_users_topup)
  - [/reseller/users/api\_key/](#api_reseller_get_users_api_key)
  - [/reseller/users/api\_key/](#api_reseller_post_users_api_key)+ [SMS](#api_sms)
  - [/sms/send/](#api_sms_send)
  - [/sms/templates/](#api_sms_template)
  - [/sms/senderid/](#api_sms_senderid)+ [WebRTC](#api_webrtc)
  - [/webrtc/get\_key/](#api_webrtc_get_key)
  - [/webrtc/create/](#api_webrts_post_create)
  - [/webrtc/](#api_webrts_put_webrtc)
  - [/webrtc/](#api_webrts_get_webrtc)
  - [/webrtc/domain/](#api_webrts_post_webrtc_domain)
  - [/webrtc/domain/](#api_webrts_delete_webrtc_domain)
  - [/webrtc/](#api_webrts_delete_webrtc)+ [eSIM](#api_esim)
  - [/esim/devices/](#api_esim_devices)
  - [/esim/packages/](#api_esim_packages)
  - [/esim/order/](#api_esim_orders)
  - [/esim/order/<iccid>/](#api_esim_order)
  - [/esim/order/create/](#api_esim_order_create)+ [Verify](#api_verify)
  - [/verify/](#api_verify_index)
  - [/verify/check/](#api_verify_check)
* [Teamsale CRM methods](#api_crm)
  + [Clients](#api_crm_clients)
  - [/customers](#api_crm_api_0)
  - [/customers/<c\_id>](#api_crm_api_1)
  - [/customers](#api_crm_api_2)
  - [/customers/<c\_id>](#api_crm_api_3)
  - [/customers/<c\_id>](#api_crm_api_4)+ [Source tags](#api_crm_utms)
  - [/customers/utms](#api_crm_utms_get_utms)
  - [/customers/utms](#api_crm_utms_create_utm)
  - [/customers/utms/<utm\_id>](#api_crm_utms_update_utm)
  - [/customers/utms/<utm\_id>](#api_crm_utms_delete_utm)+ [Labels](#api_crm_tags)
  - [/customers/labels](#api_crm_api_5)
  - [/customers/labels](#api_crm_api_6)
  - [/customers/labels/<l\_id>](#api_crm_api_7)+ [Additional features](#api_crm_additional)
  - [/customers/custom-properties](#api_crm_api_8)+ [Client timeline](#api_crm_client_line)
  - [/customers/<c\_id>/feed](#api_crm_api_9)
  - [/customers/<c\_id>/feed](#api_crm_api_10)
  - [/customers/<c\_id>/feed/<i\_id>](#api_crm_api_11)
  - [/customers/<c\_id>/feed/<i\_id>](#api_crm_api_12)+ [Employees](#api_crm_employers)
  - [/customers/<c\_id>/employees](#api_crm_api_13)
  - [/customers/<c\_id>/employees/<e\_id>](#api_crm_api_14)
  - [/customers/<c\_id>/employees](#api_crm_api_15)
  - [/customers/<c\_id>/employees/<e\_id>](#api_crm_api_16)
  - [/customers/<c\_id>/employees/<e\_id>](#api_crm_api_17)+ [Leads](#api_crm_leads)
  - [/leads](#api_crm_api_24)
  - [/leads/<lead\_id>](#api_crm_api_25)
  - [/leads](#api_crm_api_26)
  - [/leads/<lead\_id>](#api_crm_api_27)
  - [/leads/<lead\_id>](#api_crm_api_28)+ [Users](#api_crm_users)
  - [/users](#api_crm_api_29)
  - [/users/<user\_id>](#api_crm_api_30)
  - [/users/<user\_id>/working-hours](#api_crm_api_31)
  - [/users/groups](#api_crm_api_32)+ [Generalized contacts](#api_crm_contacts)
  - [/contacts](#api_crm_api_34)
  - [/contacts/identify](#api_crm_api_35)+ [Deals](#api_crm_deals)
  - [/deals](#api_crm_deals_get_deals)
  - [/deals/<deal\_id>](#api_crm_deals_get_deal)
  - [/deals](#api_crm_deals_create_deal)
  - [/deals/<deal\_id>](#api_crm_deals_update_deal)
  - [/deals/<deal\_id>](#api_crm_deals_delete_deal)+ [Deal feed](#crm_api_deal_feed)
  - [/deals/<deal\_id>/feed](#api_crm_deal_feed_get)
  - [/deals/<deal\_id>/feed](#api_crm_deal_feed_add)
  - [/deals/<deal\_id>/feed/<i\_id>](#api_crm_deal_feed_edit)
  - [/deals/<deal\_id>/feed/<i\_id>](#api_crm_deal_feed_delete)+ [Tasks](#api_crm_tasks)
  - [/events](#api_crm_api_18)
  - [/events/<event\_id>](#api_crm_api_19)
  - [/events](#api_crm_api_20)
  - [/events/<event\_id>](#api_crm_api_21)
  - [/events/<event\_id>/close](#api_crm_api_22)
  - [/events/<event\_id>](#api_crm_api_23)+ [Calls](#api_crm_calls)
  - [/calls](#api_crm_api_33)+ [Files](#api_crm_files)
  - [/files/<file\_id>](#api_crm_api_36)
* [Webhook](#api_webhooks)
  + [Calls](#api_webhook_calls)
  - [notify\_start](#api_webhook_notify_start)
  - [notify\_internal](#api_webhook_notify_internal)
  - [notify\_answer](#api_webhook_notify_answer)
  - [notify\_end](#api_webhook_notify_end)
  - [notify\_out\_start](#api_webhook_notify_out_start)
  - [notify\_out\_end](#api_webhook_notify_out_end)
  - [notify\_record](#api_webhook_notify_record)
  - [notify\_ivr](#api_webhook_notify_ivr)+ [Other](#other_methods)
  - [number\_lookup](#other_methods_number_lookup)
  - [call\_tracking](#other_methods_call_tracking)
  - [sms](#other_methods_sms)
  - [speech\_recognition](#other_methods_speech_recognition)
  - [document](#other_methods_document)

JSON
XML

# Introduction

API interface is absolutely free and available for all Zadarma accounts

Link to the API

<https://api.zadarma.com>

Version

v1

Link to the method

https://api.zadarma.com/v1/METHOD/

## Libraries

Download the ready-made classes for working with the API

[PHP](https://github.com/zadarma/user-api-v1)

[С#](https://github.com/zadarma/user-api-cs-v1)

[Python](https://github.com/zadarma/user-api-py-v1)

[TypeScript (JS)](https://github.com/zadarma/user-api-typescript)

[Zadarma на GitHub](https://github.com/zadarma)

## Examples of working with the API

* [Integration of your CRM and Zadarma telephony](/en/support/instructions/crm-zadarma/)
* [Multilevel menu of any complexity](/en/blog/api-multi-ivr/)
* [Dynamic IVR](/en/blog/ivr-webhook-en/)
* [Creating leads in Teamsale from a website form](https://zadarma.com/en/blog/creating-lead-forms/)
* [Integrating a web phone to your system](/en/blog/web-phone/) (WebRTC on your website)
* [Telecom services under your own brand](/en/support/instructions/api/partners/) (White Label)
* [Working with virtual numbers via API](/en/support/instructions/api/numbers/)

## All main features are available in API to work with:

* Telephony and virtual numbers
* PBX and Teamsale CRM
* SMS and HLR-requests
* Call tracking
* Speech Recognition

## Authorization

Each authorization request should be sent with an additional header:

**"Authorization: user\_key: signature"**

Authorization keys must be generated in your [personal account](https://my.zadarma.com/api/).

The signature is made according to the following algorithm:

* The array of transmitted data (GET, POST, PUT, DELETE) is sorted by the key name in alphabetical order;
* The received array forms the query strip (for example, http\_build\_query function in PHP), example "from=DATEFROM&to=DATETO…";
* It is then concatenated as follows: line = method\_name request\_line md5(request\_line), where “method\_name” is the request line after the domain (with indication of API version) till the beginning of the parameters list, for example - '[/v1/sip/](#)'
* The resulting string is hashed by the algorithm sha1 with the secret user key: [hash](#) = hash( string, secret\_key )
* And then the hash is encrypted in base64 [signature](#) = base64\_encode( hash )

```
                                    ksort($params);
$paramsStr = http_build_query($params, null, '&', PHP_QUERY_RFC1738);
$sign = base64_encode(hash_hmac('sha1', $method . $paramsStr . md5($paramsStr), $secret));
$header = 'Authorization: ' . $userKey . ':' . $sign;
```

**You can download the complete PHP class for Zadarma API on [GitHub](https://github.com/zadarma/user-api-v1).**

The Content-Type header for POST and PUT requests must be either application/x-www-form-urlencoded or multipart/form-data.

The response formats: [json](http://json.org/) (default) and [xml](http://www.w3.org/XML/).

To get the response from the API in xml format, the “format=xml” parameter must be added to the request line.

## Restrictions

```
                                    {
    "status":"error",
    "message":"Check phone's number"
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>error</status>
    <message>Check phone number</message>
</answer>
```

**Each response contains information about the limits and the current request, for example:**

X-Zadarma-Method: /v1/
X-RateLimit-Reset: 1434371160
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99

Where:

* X-Zadarma-Method - current requested method;
* X-RateLimit-Remaining - the amount of requests remaining after taking into account the method and user limits;
* X-RateLimit-Limit - the total number of request limits per minute;
* X-RateLimit-Reset - limit reset time.

Total limits - 100 requests per minute, for statistics methods - 3 requests per minute.

In case of blocking, the method returns the response with [429 header](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) *"You exceeded the rate limit"*.

The response contains a mandatory **"status"** key (*success* or *error*). Afterwards, depending on the method, corresponding keys are provided with the requested information.

In case of an error, additional **"message"** key is provided with an error description.

Also all responses are provided with corresponding [HTTP-headers](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).

**Attention:**  if you need current PBX statistics,  **do not** request method statistics/pbx/ every minute. Enable [webhooks](https://zadarma.com/en/support/api/#api_webhook_notify_start)notifications and receive information on every call at its start and end.

# Methods

## Info

## get /v1/info/balance/

user balance

```
                                    {
    "status":"success", 
    "balance":10.34, 
    "currency":"USD"
}
```

```
                                    <?xml version="1.0">
<answer>
    <status>success</status>
    <balance>10.34</balance>
    <currency>USD</currency>
</answer>
```

## get /v1/info/price/

call rate in the user's current price plan

```
                                    {
    "status":"success",
    "info": {
        "prefix":"4420",
        "description":"United Kingdom, London",
        "price":"0.009",
        "currency":"USD",
    }
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <info>
        <prefix>4420</prefix>
        <description>United Kingdom, London</description>
        <price>0.009</price>
        <currency>USD</currency>
    </info>
</answer>
```

#### Parameters:

* **number** – phone number
* **caller\_id** (optional) – CallerID, which is used to make the call.

## get /v1/info/timezone/

user's timezone

```
                                    {
    "status":"success",
    "unixtime":1483228800,
    "datetime":"2017-01-01 00:00:00",
    "timezone":"UTC+0"
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <unixtime>1483228800</unixtime>
    <datetime>2017-01-01 00:00:00</datetime>
    <timezone>UTC+0</timezone>
</answer>
```

## get /v1/tariff/

information about the user's current price plan

```
                                    {
    "status":"success",
    "info": {
        "tariff_id":5,
        "tariff_name":"Standart, special",
        "is_active":false,
        "cost":0,
        "currency":USD,
        "used_seconds":1643,
        "used_seconds_mobile":34,
        "used_seconds_fix":726,
        "tariff_id_for_next_period":5,
        "tariff_for_next_period":Standart, special
    }
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <info>
        <tariff_id>5</tariff_id>
        <tariff_name>Standart, special</tariff_name>
        <is_active>false</is_active>
        <cost>0</cost>
        <currency>USD</currency>
        <used_seconds>1643</used_seconds>
        <used_seconds_mobile>726</used_seconds_mobile>
        <used_seconds_fix>726</used_seconds_fix>
        <tariff_id_for_next_period>5</tariff_id_for_next_period>
        <tariff_for_next_period>Standart, special</tariff_for_next_period>
    </info>
</answer>
```

**where**

* **tariff\_id**– user's current price plan ID;
* **tariff\_name** – the name of the user's current price plan;
* **is\_active** – the current price plan is active or inactive;
* **cost** – the cost of the price plan;
* **currency** – the price plan currency;
* **used\_seconds** – the amount of price plan seconds used;
* **used\_seconds\_mobile** – the amount of price plan seconds used on calls to mobiles;
* **used\_seconds\_fix** – the amount of price plan seconds used on calls to landlines;
* **used\_seconds\_speech\_recognition** – number of price plan seconds used for speech recognition;
* **tariff\_id\_for\_next\_period** – the user's price plan ID for the next time period;
* **tariff\_for\_next\_period** – the name of the user's price plan for the next time period.

## get /v1/request/callback/

callback

```
                                    {
    "status":"success", 
    "from":442037691880, 
    "to":442037691881, 
    "time":1435573082
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <from>442037691880</from>
    <to>442037691881</to>
    <time>1435573082</time>
</answer>
```

#### Parameters:

* **from** – your phone/SIP number, the PBX extension or the PBX scenario, to which the CallBack is made;
* **to** – the phone or SIP number that is being called;
* **sip** (optional) – SIP user's number or the PBX extension (for example: 100), which is used to make the call. The CallerID of this number will be used; this SIP/PBX extension number will be displayed in the statistics; call recording and prefix dialling will be used if enabled for this number;
* **predicted** (optional) – if this flag is specified the request is predicted (the system calls the “to” number, and only connects it to your SIP, or your phone number, if the call is successful.);

## get /v1/request/checknumber/

number verification

```
                                    {
    "status":"success",
    "from":442037691880,
    "to":442037691881,
    "lang":"fr",
    "time":1612779278
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <from>442037691880</from>
    <to>442037691881</to>
    <lang>fr</lang>
    <time>1612779327</time>
</answer>
```

#### Parameters

* **caller\_id** - number displayed during a call, only numbers connected with Zadarma are available,
* **to** - phone number or SIP that is being called,
* **code** - code that will be played. Only numbers and not longer than 20 characters,
* **lang** - voicing language. If empty, client account language is used and checked whether available in system languages.

## post /v1/info/number\_lookup/

user database check

#### Parameters:

* **numbers** – list of numbers for user database check in international format.

If numbers contain 1 number the result will be delivered immediately; if there is a list of numbers the result will be sent to the address specified on the user database check page or, if the address was not specified, to the email address.

**Attention:** to set up this method go to the user database check page in your personal account.

#### Example of the result for 1 number:

(Response 1) 

```
                                    Response 1:  
{
    "status":"success",
    "info":{
        "mcc":"24702",
        "mnc":"02",
        "mccName":"Latvia",
        "mncName":"Tele2",
        "ported":false,
        "roaming":false,
        "errorDescription":"No Error"
    }
}
```

#### Example of the result for several numbers:

(Response 2) 

```
                                    Response 2:  
{
    "status":"success"
}
```

#### Example of the result sent to the address specified on the user database check page:

(Response 3) 

```
                                    Response 3:  
{
    "success":true,
    "description":"Success",
    "result": [
        {
            "mcc":"24702",
            "mnc":"02",
            "ported":false,
            "roaming":false,
            "errorDescription":"No Error",
            "mccName":"Latvia",
            "mncName":"Tele2",
            "number":"3712812858",
        }, ...
    ]
}
```

## get /v1/info/lists/currencies/

List of currencies

```
                                    {
    "status": "success",
    "currencies": [
        "USD",
        "EUR",
        "GBP",
        "PLN"
    ]
}
```

## get /v1/info/lists/languages/

List of languages available in personal account

```
                                    {
    "status": "success",
    "languages": [
        "en",
        "es",
        "de",
        "pl",
        "ru",
        "ua",
        "fr"
    ]
}
```

## get /v1/info/lists/tariffs/

List of price plans

```
                                    {
    "status": "success",
    "currency": "EUR",
    "tariffs": [
        {
            "tariff_id": 5,
            "name": "Standard",
            "cost": 0,
            "days": "30"
        },
        ...
    ],
    "package_tariffs": [
        {
            "id": 1,
            "name": "EU",
            "tariffs": [
                {
                    "tariff_id": 23,
                    "name": "Office",
                    "cost": 22,
                    "cost_annual": 216
                },
                ...
            ]
        },
        ...
    ]
}
```

#### Parameters

* **currency** – currency

## SIP

## get /v1/sip/

the list of user's SIP-numbers

```
                                    {
    "status":"success",
    "sips":[
        {"id":"00001", "display_name":"SIP 1", "lines":3},
        {"id":"00002", "display_name":"SIP 2", "lines":3}
    ],
    "left":3
}
```

```
                                    <?xml version="1.0"?>
    <answer>
        <status>success</status>
        <sips>
            <value>
                <id>00001</id>
                <display_name>SIP 1</display_name>
                <lines>3</lines>
            </value>
            <value>
                <id>00002</id>
                <display_name>SIP 2</display_name>
                <lines>3</lines>
            </value>
        </sips>
        <left>1</left>
    </answer>
```

**where**

* **id**– SIP ID;
* **display\_name** – displayed name;
* **lines** – the number of lines;
* **left** – the number of remaining SIPs, which can be created (depends on the user's balance and the total number of SIPs already created).

## get /v1/sip/<SIP>/status/

the user's SIP number online status

```
                                    {
    "status":"success",
    "sip":"00001",
    "is_online":"false"
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <sip>00001</sip>
    <is_online>false</is_online>
</answer>
```

## put /v1/sip/callerid/

changing of the CallerID

```
                                    {
    "status":"success",
    "sip":"00001",
    "new_caller_id":"442037691880"
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <sip>00001</sip>
    <new_caller_id>442037691880</new_caller_id>
</answer>
```

#### Parameters:

* **id** – the SIP ID, which needs the CallerID to be changed;
* **number** – the new (changed) phone number, in international format (from the list of confirmed or purchased phone numbers.

## get /v1/sip/redirection/

display of the current call forwarding based on the user's SIP numbers

```
                                    {
    "status":"success",
    "info": [
        {
            "sip_id":"00001",
            "status":"on",
            "condition":"always",
            "destination":"phone",
            "destination_value":"442037691880"
        },
    ...
    ]
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <info>
        <value>
            <sip_id>00001</sip_id>
            <status>on</status>
            <condition>always</condition>
            <destination>phone</destination>
            <destination_value>442037691880</destination_value>
        </value>
    ...
    </info>
</answer>
```

#### Parameters:

* **id** – (optional) selection of the specific SIP ID.

**where**

* **sip\_id** – the user's SIP ID;
* **status** – current status: on or off;
* **condition** – call forwarding conditions: always – always (default), unavailable – when the call is unanswered or if there is no SIP connection;
* **destination** – where the call is forwarded to: phone – to the phone number, pbx – to the PBX;
* **destination\_value** – the number for the call forwarding: phone number or the PBX ID.

## put /v1/sip/redirection/

call forwarding switch on/off based on the SIP number

```
                                    {
    "status":"success",
    "sip":"00001",
    "current_status":"on"
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <sip>00001</sip>
    <current_status>on</current_status>
</answer>
```

#### Parameters:

* **id** – SIP ID;
* **status** – the call forwarding status on the selected SIP number.

## put /v1/sip/redirection/

changing of the call forwarding parameters

```
                                    {
    "status":"success",
    "sip":"00001",
    "destination":"442037691880"
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <sip>00001</sip>
    <destination>442037691880</destination>
</answer>
```

#### Parameters:

* **id** – SIP ID;
* **type** – call forwarding type: phone – to the phone;
* **number** – phone number
* **condition** – optional parameter, call forwarding condition (always, unavailable - when there is no response or no SIP connection)

## post /v1/sip/create/

SIP number creation

```
                                    {
    "status": "success",
    "sip": "123456"
}
```

#### Parameters

* **name** - displayed name;
* **password** - password;
* **callerid** - number for CallerID;
* **redirect\_to\_phone** - optional parameter, SIP forwarding to phone number;
* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## put /v1/sip/<SIP>/password/

SIP password change

#### Parameters

```
                                    {
    "status":"success",
    "sip":$sip,
}
```

* **value** - new password;
* **user\_id** - optional parameter, available for use only by dealers and only for users they have created.

## Statistics

## get /v1/statistics/

receive overall statistics

(Response 1) 

```
                                    Response 1:  
{
    "status":"success",
    "start":"2015-06-01 00:00:00",
    "end":"2015-06-29 13:45:23",
    "stats":[
        {
            "id":"155112249",
            "sip":"00001",
            "callstart":"2015-06-02 12:20:25",
            "from":442037691880,
            "to":442037691881,
            "description":"United Kingdom, London",
            "disposition":"busy",
            "billseconds":0,
            "cost":0.1950,
            "billcost":0.0000,
            "currency":"USD"
        },
        …
    ]
}
```

```
                                    Response 1:  
<?xml version="1.0"?>
<answer>
    <status>success</status>
    <start>2015-06-01 00:00:00</start>
    <end>2015-06-29 13:58:22</end>
    <stats>
        <value>
            <id>155112249</id>
            <sip>00001</sip>
            <callstart>2015-06-02 12:20:25</callstart>
            <description>United Kingdom, London</description>
            <disposition>busy</disposition>
            <billseconds>0</billseconds>
            <cost>0.195</cost>
            <billcost>0</billcost>
            <currency>USD</currency>
            <from>442037691880</from>
            <to>442037691881</to>
        </value>
        …
    </stats>
</answer>
```

#### Parameters:

* **start** - the start date of the statistics display (format - YYYY-MM-DD HH:MM:SS);
* **end** - the end date of the statistics display (format - YYYY-MM-DD HH:MM:SS);
* **sip** (optional) - filter based on a specific SIP number;
* **cost\_only** (optional) - display only the amount of funds spent during a specific period;
* **type** (optional - only for the overall statistics) - request type: overall (is not specified in the request) and toll-free (800 numbers).
* **skip** (optional - not taken into account when the parameter is cost\_only) - number of lines to be skipped in the sample. The output begins from skip +1 line (used for the pagination with the limit parameter, equals to 0 by default);
* **limit** (optional - not taken into account when the parameter is cost\_only) - the limit on the number of input lines (used for the pagination with the skip parameter, the maximum value is 1000, the default value is 1000).

**Maximum period** of getting statistics is - **1 month**. If the limit in the request is exceeded, the time period automatically decreases to 30 days. If the start date is not specified, the start of the current month will be selected. If the end date is not specified, the current date and time will be selected.

**Maximum number of input lines** for one request - **1000**. For pagination use the skip and limit parameters.

**?type=cost\_only:**

(Response 2) 

```
                                    Response 2:  
{
    "status":"success",
    "start":"2015-06-01 00:00:00",
    "end":"2015-06-29 14:03:57",
    "stats":[
        {
            "cost":38.094,
            "currency":"USD",
            "seconds":9785
        }
    ]
}
```

```
                                    Response 2:  
<?xml version="1.0"?>
<answer>
    <status>success</status>
    <start>2015-06-01 00:00:00</start>
    <end>2015-06-29 14:03:30</end>
    <stats>
    <value>
        <cost>38.094</cost>
        <currency>USD</currency>
        <seconds>9785</seconds>
    </value>
    </stats>
</answer>
```

**where**

* **start** – start date of the statistics display;
* **end** – end date of the statistics display;
* **id** – call ID;
* **sip** – SIP-number;
* **callstart** – the call start time;
* **description** – description of call destination;
* **disposition** – the call status:
  + **'answered'** – conversation,
  + **'busy'** – busy,
  + **'cancel'** - cancelled,
  + **'no answer'** - no answer,
  + **'call failed'** - failed,
  + **'no money'** - no funds, the limit has been exceeded,
  + **'unallocated number'** - the phone number does not exist,
  + **'no limit'** - the limit has been exceeded,
  + **'no day limit'** - the day limit has been exceeded,
  + **'line limit'** - the line limit has been exceeded,
  + **'no money, no limit'** - the limit has been exceeded;
* **billseconds** – the amount of seconds;
* **cost** – the cost per minute of calls to this destination;
* **billcost** – the cost of the paid minutes;
* **currency** – the cost currency;
* **from** – which number was used to make a call;
* **to** – the phone number that was called.

## get /v1/statistics/pbx/

PBX statistics

**Attention:**  if you need current PBX statistics,  **do not** request method statistics/pbx/ every minute. Enable [webhooks](https://zadarma.com/en/support/api/#api_webhook_notify_start)notifications and receive information on every call at its start and end.

```
                                    {
    "status":"success",
    "start":"2015-06-01 00:00:00",
    "end":"2015-06-30 23:59:59",
    "version":2,
    "stats":[
        {
            "call_id":1439981389.2702773,
            "sip":200,
            "callstart":"2015-06-01 15:04:00",
            "clid":200,
            "destination":5,
            "disposition":"answered",
            "seconds":5,
            "is_recorded":true,
            "pbx_call_id":"in_ae6b03b3b0765d127ec0b739209346bbc4f0d52d"
        },
        …
    ]
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success<</status>
        <start>2015-06-01 00:00:00</start>
        <end>2015-06-30 23:59:59</end>
        <version>2</version>
        <stats>
        <value>
            <call_id>1439981389.2702773</call_id>
            <sip>200</sip>
            <callstart>2015-06-01 15:04:00</date>
            <clid>200</clid>
            <destination>5</destination>
            <disposition>answered</disposition>
            <seconds>5</seconds>
            <is_recorded>true</is_recorded>
            <pbx_call_id>in_ae6b03b3b0765d127ec0b739209346bbc4f0d52d</pbx_call_id>
        </value>
        …
    </stats>
</answer>
```

#### Parameters:

* **start** - the start date of the statistics display (format - YYYY-MM-DD HH:MM:SS);
* **end** - the end date of the statistics display (format - YYYY-MM-DD HH:MM:SS);
* **version** - format of the statistics result (2 - new, 1 - old);
* **skip** (optional) - number of lines to be skipped in the sample. The output begins from skip +1 line (used for the pagination with the limit parameter, equals to 0 by default);
* **limit** (optional) - the limit on the number of input lines (used for the pagination with the skip parameter, the maximum value is 1000, the default value is 1000).
* **call\_type** (optional) - call destination ('in' for incoming, 'out' for outgoing). If not specified, all calls are displayed.

**where**

* **start** – the start date of the statistics display;
* **end** – the end date of the statistics display;
* **version** - format of the statistics result (2 - new, 1 - old);
* **call\_id** – unique call ID, it is specified in the name of the file with the call recording (unique for every recording);
* **sip** – SIP-number;
* **callstart** – the call start time;
* **clid** – CallerID;
* **destination** – the call destination;
* **disposition** – the call status:
  + **'answered'** – conversation,
  + **'busy'** – busy,
  + **'cancel'** - cancelled,
  + **'no answer'** - no answer,
  + **'call failed'** - failed,
  + **'no money'** - no funds, the limit has been exceeded,
  + **'unallocated number'** - the phone number does not exist,
  + **'no limit'** - the limit has been exceeded,
  + **'no day limit'** - the day limit has been exceeded,
  + **'line limit'** - the line limit has been exceeded,
  + **'no money, no limit'** - the limit has been exceeded;
* **seconds** – the amount of seconds;
* **is\_recorded** – (true, false) recorded or no conversations;
* **pbx\_call\_id** – permanent ID of the external call to the PBX (does not alter with the scenario changes, voice menu, etc., it is displayed in the statistics and notifications);

## get /v1/statistics/callback\_widget/

callBack widget statistics

```
                                    {
    "status":"success",
    "start":"2016-09-01 00:00:00",
    "end":"2016-09-30 23:59:59",
    "stats":[
        {
            "id":"57d16d6a1e46c53d1f8ce323",
            "widget_id":"1",
            "sip":"00001",
            "ip":"127.0.0.1",
            "actions":[
                {
                    "kind":"come",
                    "date":"2016-09-08 16:53:45",
                    "referrer_url":"http://test.domain.com/page1/",
                    "url":"http://home.domain.com/page2/"
                },
                {
                    "kind":"show",
                    "date":"2016-09-08 16:53:46",
                    "rate":15
                },
                {
                    "kind":"call_request",
                    "date":"2016-09-08 16:54:07",
                    "number":"442037691880",
                    "request_call_date":"2016-09-09 10:00:00",
                    "redial":"n"
                },
                {
                    "kind":"close",
                    "date":"2016-09-08 16:54:35"
                }
            ]
        },
        ...
    ]
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <start>2016-09-01 00:00:00</start>
    <end>2016-09-30 23:59:59</end>
    <stats>
        <value>
            <id>57d16d6a1e46c53d1f8ce323</id>
            <widget_id>1</widget_id>
            <sip>00001</sip>
            <ip>127.0.0.1</ip>
            <actions>
                <value>
                    <kind>come</kind>
                    <date>2016-09-08 16:53:45</date>
                    <referrer_url>http://test.domain.com/page1/</referrer_url>
                    <url>http://home.domain.com/page2/</url>
                </value>
                <value>
                    <kind>show</kind>
                    <date>2016-09-08 16:53:46</date>
                    <rate>15</rate>
                </value>
                <value>
                    <kind>call_request</kind>
                    <date>2016-09-08 16:54:07</date>
                    <number>442037691880</number>
                    <request_call_date>2016-09-09 10:00:00</request_call_date>
                    <redial>n</redial>
                </value>
                <value>
                    <kind>close</kind>
                    <date>2016-09-08 16:54:35</date>
                </value>
            </actions>
        </value>
            ...
    </stats>
</answer>
```

#### Parameters:

* **start** - the start date of the statistics display (format - YYYY-MM-DD HH:MM:SS);
* **end** - the end date of the statistics display (format - YYYY-MM-DD HH:MM:SS);
* **widget\_id** - (optional) - widget identification; if the parameter is not specified, statistics from all widgets is taken;

**Maximum period** of getting the statistics is - **1 month**. If the limit in the request is exceeded, the time period automatically decreases to 30 days. If the start date is not specified, the start of the current month will be selected. If the end date is not specified, the current date and time will be selected.

**Maximum number of input lines** for one request - **1000**. For pagination use the skip and limit parameters.

**where**

* **start** – the start date of the statistics display;
* **end** – the end date of the statistics display;
* **id** – session ID;
* **widget\_id** – widget ID;
* **sip** – SIP-number;
* **ip** – user's IP-address;
* **kind** – event type:
  + **'come'** – the user visited the page with the widget,
  + **'show'** – the widget form is displayed,
  + **'call'** – CallBack request,
  + **'call\_request'** – delayed CallBack request,
  + **'rate'** – the user rated the call,
  + **'fail'** – the user reported that there was no CallBack,
  + **'close'** – the user has closed the widget form;
* **date** – the event date and time;
* **referrer\_url** – the URL address, from which the user came to the page with the widget(only for the event 'come');
* **url** – the URL address of the widget page (only for the event 'come');
* **rate** – for the event 'show' - number of points, for the event 'rate' - call rate;
* **request\_call\_date** – the date and time for the CallBack specified by the user(only for the event 'call\_request');
* **redial** – (true, false) was there a CallBack for the delayed CallBack request (only for the event 'call\_request');
* **number** – the phone number entered by the user (for the events: 'call', 'call\_request', 'rate', 'fail').

## get /v1/statistics/incoming-calls/

getting general incoming call statistics

```
                                    {
    "status":"success",
    "start":"2015-06-01 00:00:00",
    "end":"2015-06-29 13:45:23",
    "stats":[
        {
            "id":"155112249",
            "sip":"00001",
            "callstart":"2015-06-02 12:20:25",
            "from":442037691880,
            "to":442037691881,
            "billseconds":0,
            "disposition":"busy",
            "description":"United Kingdom, London"
        },
        …
    ]
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <start>2015-06-01 00:00:00</start>
    <end>2015-06-29 13:58:22</end>
    <stats>
        <value>
            <id>155112249</id>
            <sip>00001</sip>
            <callstart>2015-06-02 12:20:25</callstart>
            <from>442037691880</from>
            <to>442037691881</to>
            <billseconds>0</billseconds>
            <disposition>busy</disposition>
            <description>United Kingdom, London</description>
        </value>
        …
    </stats>
</answer>
```

#### Parameters

* **start** - statistics viewing beginning date (format - YYYY-MM-DD HH:MM:SS);
* **end** - statistics viewing ending date (format - YYYY-MM-DD HH:MM:SS);
* **sip** (optional) – filter by a certain SIP number;
* **skip** (optional – not considered if cost\_only parameter is set) – number of lines, that needs to be skipped in the sample, the result will start with the line skip + 1 (used for pagination together with the parameter limit, by default equals 0);
* **limit** (optional – not considered if cost\_only parameter is set) – a limit of a number of displayed lines (used for pagination together with the parameter skip, the maximum value is 1000, by default 1000).

**Maximum period** for statistics - **months**. In case of existing the limit – period automatically reduced to 30 days. If the sample beginning date is not set, the beginning of the current month is chosen. If the sample ending date is not set, the sample ending is set at the current date and time.

**Maximum number of displayed lines** for one request - **1000**. Use parameters skip and limit for pagination.

#### Where:

* **start** – statistics displaying beginning date;
* **end** – statistics displaying ending date;
* **id** – call id;
* **sip** – SIP number;
* **callstart** – call beginning time;
* **from** – the number the call was received from;
* **to** – the called number;
* **billseconds** – call duration is seconds;
* **disposition** – call status:
  + **'answered'** – on-going call,
  + **'busy'** – busy,
  + **'cancel'** - cancelled,
  + **'no answer'** - no response,
  + **'failed'** - failed,
  + **'no money'** - no funds, limit exceeded,
  + **'unallocated number'** - number does not exist,
  + **'no limit'** - limit exceeded,
  + **'no day limit'** - daily limit exceeded,
  + **'line limit'** - line limit exceeded,
  + **'no money, no limit'** - limit exceeded;
* **description** – call destination description.

## PBX

## post /v1/pbx/redirection/

changing of the call forwarding parameters on the PBX extension

```
                                    {
    "status":"success",
    "current_status":"on",
    "pbx_id":"1234",
    "pbx_name":"100",
    "type":"phone",
    "destination":"442037691880",
    "condition":"noanswer"
}
```

```
                                    <?xml version="1.0"?>
    <answer>
    <status>success</status>
    <current_status>on</current_status>
    <pbx_id>1234</pbx_id>
    <pbx_name>100</pbx_name>
    <type>phone</type>
    <destination>442037691880</destination>
    <condition>noanswer</condition>
    </answer>
```

#### Parameters:

To switch on and set up the call forwarding:

* **pbx\_number** – PBX extension, for example 100;
* **status** – on;
* **type** – call forwarding type: phone, voicemail, menu, sip, or sip\_uri;
* **destination** – phone number, email address, voice menu or call scenario ID, your SIP or PBX extension, or the address of an external server in SIP URI format, depending on the type of call forwarding selected in the previous “type” parameter;
* **condition** – call forwarding condition, possible values: always or noanswer;
* **voicemail\_greeting** – notifications about call forwarding, possible values: no, standart, own. Specified only when type = voicemail;
* **greeting\_file** – file with notification in mp3 format or wav below 5 MB. Specified only when type = voicemail and voicemail\_greeting = own;

To switch on the call forwarding:

* **pbx\_number** – PBX extension, for example 100;
* **status** – off;

## get /v1/pbx/redirection/

receiving call forwarding parameters on the PBX extension

```
                                    {
    "status":"success",
    "current_status":"on",
    "pbx_id":"1234",
    "pbx_name":"100",
    "type":"phone",
    "destination":"442037691880",
    "condition":"noanswer",
}
```

#### Parameters:

* **pbx\_number** – PBX extension, for example 100;

## get /v1/pbx/record/request/

call recording file request

#### Parameters:

* **call\_id** – unique call ID, it is specified in the name of the file with the call recording (unique for every recording);
* **pbx\_call\_id** – permanent ID of the external call to the PBX (does not alter with the scenario changes, voice menu, etc., it is displayed in the statistics and notifications);
* **lifetime** – (optional) the link's lifetime in seconds (minimum - 180, maximum - 5184000, default - 1800).

**Note:** It is enough to specify one of the two identification parameters (pbx\_call\_id or call\_id), if pbx\_call\_id is specified, several links might be returned.

**Response example when only call\_id is specified, only one link will be returned:**

(Response 1) 

```
                                    Response 1:  
{
    "status":"success",
    "link": "https://api.zadarma.com/v1/pbx/record/download/NjM3M..NzM2Mg/1-1458313316.343456-100-2016-01-11-100155.mp3",
    "lifetime_till": "2016-01-01 23:56:22"
}
```

```
                                    Response 1:  
<?xml version="1.0"?>
<answer>
    <status>success</status>
    <link>https://api.zadarma.com/v1/pbx/record/download/NjM3M..NzM2Mg/1-1458313316.343456-100-2016-01-11-100155.mp3</link>
    <lifetime_till>2016-01-01 23:56:22</lifetime_till>
</answer>
```

**Response example when only call\_id is specified, several links might be returned:**

(Response 2) 

```
                                    Response 2:  
{
    "status":"success",
    "links":[
        "https://api.zadarma.com/v1/pbx/record/download/NjM3M..NzM2Mg/1-1458313316.343456-100-2016-01-11-100155.mp3",
        "https://api.zadarma.com/v1/pbx/record/download/pw7Cj..iOzn99/1-1458313475.213487-101-2016-01-11-100211.mp3"
    ],
    "lifetime_till": "2016-01-01 23:56:22"
}
```

```
                                    Response 2:  
<?xml version="1.0"?>
<answer>
    <status>success</status>
    <links>
        <value>https://api.zadarma.com/v1/pbx/record/download/NjM3M..NzM2Mg/1-1458313316.343456-100-2016-01-11-100155.mp3<</value>
        <value>https://api.zadarma.com/v1/pbx/record/download/pw7Cj..iOzn99/1-1458313475.213487-101-2016-01-11-100211.mp3</value>
    </links>
    <lifetime_till>2016-01-01 23:56:22</lifetime_till>
</answer>
```

#### Parameters:

* **link** – the link to the file of the call;
* **lifetime\_till** – until what time will the link work.

## delete /v1/pbx/record/request/

deletion of the call recording file

#### Parameters

* **call\_id** – unique call ID, this ID is specified in the name of the call recording file (unique for each entry in the statistics);
* **pbx\_call\_id** – a permanent ID of the external call in the PBX (does not change when going through scenarios, voice menus, transfers, etc., and is displayed in statistics and notifications).

**Note:** it is sufficient to specify one of the two identification parameters (pbx\_call\_id or call\_id), when pbx\_call\_id is provided, multiple recording files may be deleted.

**Example of a response when only call\_id is specified and one file is deleted:**

(Response 1) 

```
                                    Response 1:  
{
    "status":"success",
    "file_name": "filename.mp3"
}
```

```
                                    Response 1:  
<?xml version="1.0"?>
<answer>
    <status>success</status>
    <file_name>filename.mp3</file_name>
</answer>
```

**Example of a response when only pbx\_call\_id is specified, multiple files may be deleted:**

(Response 2) 

```
                                    Response 2:  
{
    "status":"success",
    "deleted_files":[
        "filename1.mp3",
        "filename2.mp3"
    ]
}
```

```
                                    Response 2:  
<?xml version="1.0"?>
<answer>
    <status>success</status>
    <deleted_files>
        <value>filename1.mp3</value>
        <value>filename2.mp3</value>
    </deleted_files>
</answer>
```

#### Parameters:

* **file\_name** – name of the deleted file;
* **deleted\_files** – list of deleted files;
* **failed\_files** – list of files that could not be deleted.

## post /v1/pbx/waitmelody/upload

uploading a hold music instead of beeps

#### Parameters

* **file** - the file itself

## put /v1/pbx/waitmelody/switch

on/off hold music for PBX

#### Parameters

* **state** - state (on - enabled, off - disabled);
* **melody** - music type (none – no music by default, mymelody – user’s previously uploaded music).

## delete /v1/pbx/waitmelody/delete

deleting a hold music instead of beeps

## get /v1/pbx/callinfo/

get pbx call info settings

```
                                    {
    "status": "success",
    "url": "",
    "notifications": {
        "notify_start": "true",
        "notify_internal": "false",
        "notify_end": "true",
        "notify_out_start": "false",
        "notify_out_end": "false",
        "notify_answer": "false"
    }
}
```

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## post /v1/pbx/callinfo/url/

url change for pbx call info

```
                                    {
    "status": "success",
    "url": ""
}
```

#### Parameters:

* **url** - url link;
* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## post /v1/pbx/callinfo/notifications/

Enabling or disabling webhook notifications NOTIFY\_\* for pbx call info

```
                                    {
    "status": "success",
    "notifications": {
        "notify_start": "true",
        "notify_internal": "false",
        "notify_end": "true",
        "notify_out_start": "false",
        "notify_out_end": "false",
        "notify_answer": "false"
    }
}
```

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them;
* **notify\_start** - "true" or "false" optional parameter;
* **notify\_internal** - "true" or "false" optional parameter;
* **notify\_end** - "true" or "false" optional parameter;
* **notify\_out\_start** - "true" or "false" optional parameter;
* **notify\_out\_end** - "true" or "false" optional parameter;
* **notify\_answer** - "true" or "false" optional parameter.

## delete /v1/pbx/callinfo/url/

url deletion for pbx call info

```
                                    {
    "status": "success",
    "url": ""
}
```

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## post /v1/pbx/create/

PBX creation

```
                                    {
    "status": "success",
    "stop_datetime": "2021-12-31 23:59:59"
}
```

#### Parameters:

* **sip\_id** - SIP number for PBX connection, if not set try choosing an available SIP (optional parameter);
* **password** - password for the first PBX number '100';
* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## get /v1/pbx/webhooks/

get pbx webhooks settings

```
                                    {
    "status": "success",
    "url": "",
    "hooks": {
        "number_lookup": "true",
        "call_tracking": "false",
        "sms": "true",
        "speech_recognition": "true"
    }
}
```

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## post /v1/pbx/webhooks/url/

url change for pbx webhooks

```
                                    {
    "status": "success",
    "url": ""
}
```

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them;
* **url** - url link.

## post /v1/pbx/webhooks/hooks/

Enabling or disbalning other webhook notifications (Contact updates, Call tracking, SMS, and Speech analytics).

```
                                    {
    "status": "success",
    "hooks": {
        "number_lookup": "true",
        "call_tracking": "false",
        "sms": "true",
        "speech_recognition": "true"
    }
}
```

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them;
* **number\_lookup** - "true" or "false" optional parameter;
* **call\_tracking** - "true" or "false" optional parameter;
* **sms** - "true" or "false" optional parameter;
* **speech\_recognition** - "true" or "false" optional parameter.

## delete /v1/pbx/webhooks/url/

url deletion for other notifications (Updating contacts, Call tracking, SMS and Speech analytics)

```
                                    {
    "status": "success",
    "url": ""
}
```

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## PBX (extensions)

## get /v1/pbx/internal/

the PBX extension display

```
                                    {
    "status":"success",
    "pbx_id":1234,
    "numbers": [
        100,
        101,
        ...
    ]
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <pbx_id>1234</pbx_id>
    <numbers>
        <value>100</value>
        <value>101</value>
        ...
    </numbers>
</answer>
```

**where**

* **pbx\_id** – the user's PBX ID;
* **numbers** – the list of extensions.

## get /v1/pbx/internal/<PBXSIP>/status/

online status of the PBX extension

```
                                    {
    "status":"success",
    "pbx_id":1234,
    "number":100,
    "is_online":"false"
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <pbx_id>1234</pbx_id>
    <number>100</number>
    <is_online>false</is_online>
</answer>
```

**where**

* **pbx\_id** – PBX ID;
* **number** – PBX extension;
* **is\_online** – online-status (true|false).

## get /v1/pbx/internal/<PBXSIP>/info/

PBX extension information

```
                                    {
    "status": "success",
    "pbx_id": 12345,
    "number": 100,
    "name": "Extension 100",
    "caller_id": "+44000000000",
    "caller_id_app_change": "true",
    "caller_id_by_direction": "false",
    "lines": "3",
    "ip_restriction": "1.1.1.1",
    "record_store": "For automatic speech recognition",
    "record_email": "email@server.com",
    "supervisor_status": 1
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <pbx_id>12345</pbx_id>
    <number>100</number>
    <name>Extension 100</name>
    <caller_id>+44000000000</caller_id>
    <caller_id_app_change>true</caller_id_app_change>
    <caller_id_by_direction>false</caller_id_by_direction>
    <lines>3</lines>
    <ip_restriction>1.1.1.1</ip_restriction>
    <record_store>For automatic speech recognition</record_store>
    <record_email>email@server.com</record_email>
   <supervisor_status>1</supervisor_status>
</answer>
```

**where:**

* **pbx\_id** – pbx-id;
* **number** – pbx extension;
* **name** – displayed name;
* **caller\_id** – CallerID;
* **caller\_id\_app\_change** – CallerID change from the app (true|false);
* **caller\_id\_by\_direction** – CallerID by destination (true|false);
* **lines** – number of lines;
* **ip\_restriction** – access restrictions by ip (false if not set);
* **record\_store** – call recording to the cloud storage (Without recognition|For manual recognition|For automatic speech recognition|false);
* **record\_email** – email for sending call recordings (false if not set).

## put /v1/pbx/internal/recording/

enabling of the call recording on the PBX extension

```
                                    {
    "status":"success",
    "internal_number":100,
    "recording":"on",
    "email":"test@test.com",
    "speech_recognition":"all"
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <internal_number>100</internal_number>
    <recording>on</recording>
    <email>on</email>
    <speech_recognition>all</speech_recognition>
</answer>
```

#### Parameters:

* **id** – PBX extension;
* **status** – status: "on" - switch on, "off" - switch off, "on\_email" - enable the option to send the recordings to the email address only, "off\_email" - disable the option to send the recordings to the email address only, "on\_store" - enable the option to save the recordings to the cloud, "off\_store" - disable the option to save the recordings to the cloud;
* **email** – (optional) change the email address, where the call recordings will be sent. You can specify up to 3 email addresses, separated by a comma;
* **speech\_recognition** – (optional) speech recognition settings change: "all" - transcribe all calls, "optional" - transcribe selected calls in statistics, "off" - disable.

## post /v1/pbx/internal/create/

Create a PBX extension

```
                                    {
    "status": "success",
    "numbers": [
        {
            "number": 200,
            "password": "PASSWORD"
        },
        {
            "number": 201,
            "password": "PASSWORD"
        }
    ]
}
```

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them;
* **start\_number** - number to start creating from 100 ...999 or "any" to start with the first available number within 100-999 range;
* **quantity** - quantity of PBX extensions to be created;
* **return\_password** - optional parameter, 'true' the response will have passwords for newly created numbers.

## get /v1/pbx/internal/<SIP>/password/

PBX extension password request, password is available for viewing for a limited time

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them.

#### Response example:

```
                                    {
    "status": "success",
    "pbx_id": 114,
    "number": 200,
    "password": "PASSWORD"
}
```

#### where

* **password** - can have value hidden, if the password is not available for viewing.

## put /v1/pbx/internal/<SIP>/password/

extension password change

```
                                    {
    "status": "success",
    "pbx_id": 114,
    "number": 200
}
```

#### Parameters:

* **value** - new password;
* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## put /v1/pbx/internal/<SIP>/edit/

enabling supervisor mode on the PBX extension

#### Parameters

* **supervisor\_status** - supervisor status, 0 - disabled, 1 - enabled;
* **user\_id** - optional parameter, available for use only by dealers and only for those users created by them.

## PBX (IVR)

## get /v1/pbx/ivr/sounds/list

list of already uploaded files for voice greeting (IVR)

## post /v1/pbx/ivr/sounds/upload

file upload

#### Parameters

* **name** - file name,
* **file** - the file itself.

## delete /v1/pbx/ivr/sounds/delete

deleting a file by its id

#### Parameters

* **id** - file id

## get /v1/pbx/ivr/

IVR list

```
                                    {
    "status": "success",
    "pbx_id": 114,
    "ivrs": [
        {
            "menu_id": "0",
            "title": "",
            "type": "file",
            "status": "on",
            "waitexten": 5,
            "auto_responder": {
                "status": "on",
                "waitexten": 1,
                "working_days": [
                    {
                        "day": "mon",
                        "is_active": true,
                        "begin": {
                            "hour": 9,
                            "minute": 0
                        },
                        "end": {
                            "hour": 18,
                            "minute": 0
                        }
                    },
                    {
                        "day": "tue",
                        "is_active": true,
                        "begin": {
                            "hour": 9,
                            "minute": 0
                        },
                        "end": {
                            "hour": 18,
                            "minute": 0
                        }
                    },
                    ...
                    {
                        "day": "sun",
                        "is_active": false
                    }
                ]
            },
            "dinner_status": "on",
            "dinner_time": {
                "begin": {
                    "hour": 12,
                    "minute": 0
                },
                "end": {
                    "hour": 13,
                    "minute": 0
                }
            }
        },
        {
            "menu_id": "1",
            "title": "Menu 1",
            "type": "readtext",
            "status": "off",
            "waitexten": 5,
            "auto_responder": {
                "status": "off",
                "waitexten": 1
            }
        },
        ...
    ]
}
```

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## post /v1/pbx/ivr/create/

create IVR

```
                                    {
    "status": "success",
    "menu_id": 2
}
```

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them;
* **buy** - 'true' - paid menu creation.

## delete /v1/pbx/ivr/delete/

IVR deletion

```
                                    {
    "status": "success"
}
```

#### Parameters:

* **user\_id** - ptional parameter, only available for use for reseller and users created by them;
* **menu\_id** - must be > 0.

## get /v1/pbx/ivr/scenario/

IVR scenario list

```
                                    {
    "status": "success",
    "scenarios": [
        {
            "id": "132",
            "title": "-1",
            "push_button": -1,
            "first_sips": [
                "102"
            ],
            "second_sips": [],
            "second_sips_delay": 10,
            "third_sips": [],
            "third_sips_delay": 20
        },
        ...
    ]
}
```

#### Parameters:

* **user\_id** - ptional parameter, only available for use for reseller and users created by them;
* **menu\_id** - menu ID/IVR.

## post /v1/pbx/ivr/scenario/create/

IVR scenario creation

```
                                    {
    "status": "success",
    "menu_id": 0,
    "scenario_id": 2
}
```

#### Parameters:

* **push\_button** - scenario activation upon button press: if the caller does not press any buttons, the "Without pushing" scenario is activated, 0-9 - buttons, 10 - autoresponder, 11-30 - additional scenarios;
* **title** - title;
* **extension** - extension, or numbers separated by space, or "fax";
* **menu\_id** - menu ID/IVR;
* **user\_id** - optional parameter, available for use only by dealers and only for those users created by them;
* **trigger\_to\_did\_ext\_lines** - optional parameter. Specifies during calls to which numbers the scenario is triggered. It can contain a single number or a list of numbers separated by spaces;
* **trigger\_from\_clid\_numbers** - optional parameter. Specifies from which numbers the scenario is triggered during calls. It can contain a single number or a list of numbers separated by spaces.

## put /v1/pbx/ivr/scenario/edit/

IVR scenario change

#### PUT request body:

(Response 1) 

```
                                    Response 1:  
[
  "id": "630cb6b3dc666e947503a77a",
  "title": "Scenario 1",
  "queue_strategy": "off",
  "queue_announce_position": 0,
  "numbers": [
    [
      "number": 100,
      "delay": 0,
      "duration": 20
    ],
    [
      "number": 101,
      "delay": 20,
      "duration": 20
    ],
    [
      "number": 102,
      "delay": 40,
      "duration": 20
    ],
  ]
]
```

#### Description:

* **id** - scenario ID;
* **title** - title;
* **queue\_strategy** - call distribution strategy among extensions (off, random, roundrobin, leastrecent, rrmemory, fewestcalls)
* **queue\_announce\_position** - announce queue position
* **numbers** - extensions array
  + **delay parameters and duration of extension calling**:
  + **number** - extension or "fax";
  + **delay** - calling delay in seconds
  + **duration** - calling duration in seconds

Call distribution strategy among extensions description:

* **off** - queue disabled
* **random** - distribute randomly
* **roundrobin** - distribute equally, give priority to those who haven't spoken in a long time, account all call
* **leastrecent** - distribute equally, give priority to those who haven't spoken in a long time, account only answered calls
* **rrmemory** - distribute equally, give priority to those who spoke less, account all calls
* **fewestcalls** - distribute equally, give priority to those who spoke less, account only answered calls

Calling delay and duration parameters are only used for the disabled queue (queue\_strategy : "off").

Response:
(Response 2) 

```
                                    Response 2:  

{"status": "success"}
```

Error:
(Response 3) 

```
                                    Response 3:  

{"status": "error","message": "Wrong parameters!"}
```

## delete /v1/pbx/ivr/scenario/delete/

IVR scenario deletion

```
                                    {
    "status": "success"
}
```

#### Parameters:

* **scenario\_id** - scenario ID;
* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## Speech recognition

## get /v1/speech\_recognition/

obtaining recognition results

```
                                    {        
    "status":"success",
    "lang":"en-EN",
    "recognitionStatus":"in progress",
    "otherLangs":["es-ES"],
    "words": [
        {
            "result": [
                {
                    "s": 0.02,
                    "e": 0.22,
                    "w": "word",
                },
                {
                    "s": 0.31,
                    "e": 0.56,
                    "w": "one",
                }
            ],
            "channel": 1
        }
    ],
    "phrases":[
        {
            "result": "word one",
            "channel": 1
        }
    ]
}
```

#### Parameters:

* **call\_id** – unique call id, this id is indicated in the recording file name (unique for every recording in the statistics);
* **lang** - recognition language (not required);
* **return** - returned result. Options: words - words, phrases - phrases. (not required. phrases by default);
* **alternatives** - return alternative results. Options: 0 - no, 1 - yes. (not required. 0 by default).

**where**

* **lang** – language;
* **recognitionStatus:** recognition status. Options:
  + **in progress** - in the process of recognition,
  + **error** - an error occured during recognition,
  + **recognized** - recognition complete
  + **ready for recognize** - recording is ready for recognition,
  + **not available for recognize** - recording is not available for recognition.
* **result:**
  + **words** - array:
    - **result** - list of words (array):
      * **s** - word beginning time
      * **e** - word ending time
      * **w** - word
    - **channel** - channel number
  + **phrases** - array:
    - **result** - phrase
    - **channel** - channel number

## put /v1/speech\_recognition/

Initiating call recognition in the PBX statistics requires manual recognition to be enabled beforehand in the extension settings

```
                                    {
    "status":"success"
}
```

#### Parameters:

* **call\_id** – unique call id, this id is indicated in the recording file name (unique for every recording in the statistics);
* **lang** - recognition language (not required).

## Virtual numbers

## get /v1/direct\_numbers/

information about the user's virtual numbers

```
                                    {
    "status":"success",
    "info": [
        {
            "number":"442030000000",
            "status":"on",
            "country":"United Kingdom",
            "description":"London",
            "number_name":null,
            "sip":00001,
            "sip_name":null,
            "start_date":"2015-01-01 18:14:44",
            "stop_date":"2016-02-11 18:14:40",
            "monthly_fee":2,
            "currency":USD,
            "channels":2,
            "autorenew":"true",
            "is_on_test":"false",
            "type":"common"
        },
    ...
    ]
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <info>
        <value>
            <number>442037691880</number>
            <status>on</status>
            <country>United Kingdom</country>
            <description>London</description>
            <number_name>null</number_name>
            <sip>00001</sip>
            <sip_name>Example</sip_name>
            <start_date>2015-01-01 18:14:44</start_date>
            <stop_date>2016-02-11 18:14:40</stop_date>
            <monthly_fee>2</monthly_fee>
            <currency>USD</currency>
            <channels>2</channels>
            <autorenew>true</autorenew>
            <is_on_test>false</is_on_test>
            <type>common</type>
        </value>
    ...
    </info>
</answer>
```

#### Parameters:

The fields can vary depending on the number type! The fields descriptions:

* **number** – the user's purchased virtual phone number;
* **status** – the phone number status;
  + **on** - number enabled;
  + **parking** - number disabled (there was no payment), but it stays connected to the account for 7 days and can be reactivated when the balance is topped-up;
  + **checking** - number was ordered, paid for, all required documents were uploaded, number activation pending;
  + **checking\_upload** - number was ordered and paid for, required documents have to be uploaded;
  + **reserved\_on** - number is reserved awaiting payment;
  + **reserved\_checking** - number is reserved awaiting payment, all required documents were uploaded;
  + **reserved\_checking\_upload** -number is reserved awaiting payment, required documents have to be uploaded;
* **country** – country;
* **description** – description: city or type;
* **number\_name** – the virtual phone number "name" (set by the user);
* **sip** – the SIP connected to the phone number;
* **sip\_name** – the "name" of the SIP connected to the phone number;
* **start\_date** – the date of purchase;
* **stop\_date** – the end date of the user's payment period;
* **monthly\_fee** – the phone number cost;
* **currency** – the currency of the phone number cost;
* **channels** – the number of lines on the phone number;
* **minutes** – the total duration of incoming calls for the current month (for revenue);
* **autorenew** – the automatic phone number extension is enabled or disabled;
* **is\_on\_test** – the phone number is being tested or not;
* **type** – phone number type: common (virtual number), order (ordered, but not connected)

## get /v1/direct\_numbers/number/

purchased number information

```
                                    {
    "status": "success",
    "info": {
    "number": "35924913550",
        "status": "on",
        "country": "Bulgaria",
        "description": "Sofia",
        "number_name": "TT",
        "sip": "00004",
        "sip_name": "SIP",
        "start_date": "2016-06-08 14:32:17",
        "stop_date": "2016-06-29 10:52:18",
        "monthly_fee": 2,
        "currency": "USD",
        "channels": "2",
        "autorenew": "true",
        "receive_sms": null,
        "is_on_test": "false"
    }
}
```

#### Parameters:

* **number** - number.

## get /v1/direct\_numbers/autoprolongation/

automatic renewal status

```
                                    {
    "status": "success",
    "number": "35924913550",
    "autoprolongation": "on"
}
```

#### Parameters:

* **number** - number.

## get /v1/direct\_numbers/checking-wrongs/

getting information about document or address verification errors

```
                                    {
   "status":"success",
   "info":{
      "wrong_document":{
         "document_type":"contract",
         "message":"The passport has expired. It is considered invalid."
      },
      "wrong_address":{
         "message":"Invalid address"
      }
   }
}
```

#### Parameters

* **group\_id** - document group id.

## put /v1/direct\_numbers/autoprolongation/

change automatic renewal status

```
                                    {
    "status": "success",
    "number": "35924913550",
    "autoprolongation": "off"
}
```

#### Parameters:

* **number** - number;
* **value** - new automatic extension status, on or off.

## get /v1/direct\_numbers/countries/

list of countries numbers can be ordered from

```
                                    {
    "status": "success",
    "info": [
        {
            "countryCode": "61",
            "countryCodeIso": "AU",
            "name": "Australia"
        },
        ...
    ]
}
```

#### Parameters:

* **language** - optional, if not set Personal account language will be used.

## get /v1/direct\_numbers/country/

list of destinations in the country, where a number can be ordered

```
                                    {
    "status": "success",
    "info": [
        {
            "id": "3753",
            "countryCode": "49",
            "areaCode": "800",
            "name": "800 number (Toll-free)",
            "connect_fee": 0,
            "monthly_fee": 15,
            "currency": "USD",
            "restrictions": {
                "upload": [
                    "Certificate of registration copy or passport or ID copy (both sides)",
                    "Proof of address (a copy of utility bill no older than of 6 months) - 
                    your current address (city, street, number and postal code). 
                    The address must be located in the country of ordered phone number"
                ]
            },
            "receive_sms": "false",
            "is_toll": "true",
            "feature": "Available from all networks"
            "connect_time": "0"
        },
        {
            "id": "3766",
            "countryCode": "49",
            "areaCode": "821",
            "name": "Augsburg",
            "connect_fee": 3,
            "monthly_fee": 3,
            "currency": "USD",
            "restrictions": {
                "upload": [
                    "Passport or ID copy (both sides)"
                ],
                "specify": [
                    "You current address (city, street, number and postal code). 
                    The address must be located in the region of the city 
                    where you ordered the phone number"
                ]
            },
            "receive_sms": "false",
            "is_toll": "false",
            "feature": null,
            "connect_time": "0"
        },
        ...
    ]
}
```

#### Parameters

* **language** - optional, if not set, personal account language will be used;
* **country** - iso country code (ISO 3166-1 alpha-2);
* **direction\_id** - optional parameter, obtaining data on a specific destination in the country.

## put /v1/direct\_numbers/set\_caller\_name/

caller name setup (Latin letters and digits, up to 30 characters)

```
                                    {
    "status": "success",
    "number": "+44000000000",
    "caller_name": "test"
}
```

#### Parameters

* **number** - number;
* **caller\_name** - to clear - just submit an empty field.

## put /v1/direct\_numbers/set\_sip\_id/

assigning a number to sip or test mode enabling

```
                                    {
    "status": "success",
    "number": "+44000000000",
    "sip_id": "00001"
}
```

#### Parameters

* **number** - number;
* **sip\_id** - sip number or external server address (SIP URI);
* **test\_mode** - optional, (on|off) - for enabling test mode.

## get /v1/direct\_numbers/available/<DIRECTION\_ID>/

numbers available for order

```
                                    {
    'status': 'success',
    'numbers': [
        {
            'id': 1712p0D1643D0t42r198658,
            'direction_id': 13755,
            'number': '+44000000001'
        },
        {
            'id': 184bdf85006c3f1676be200,
            'direction_id': 13755,
            'number': '+44000000000'
        },
        ...
    ]
}
```

#### Parameters:

* **DIRECTION\_ID** - destination ID;
* **mask** - optional parameter for searching number matches.

## post /v1/direct\_numbers/order/

number order/connection

```
                                    {
    'status': 'success',
    'number': '+44000000000',
    'is_reserved': 'false',
    'is_activated': 'true'
}
```

#### Parameters:

* **number\_id** - ID of the number that is being connected, received via the method GET /v1/direct\_numbers/available/<DIRECTION\_ID>/ for example: 1712p0D1643D0t42r198658 (if there is no number selection, the parameter is not used);
* **direction\_id** - destination/city ID;
* **documents\_group\_id** - ID of the group of user documents;
* **purpose** - text description of the purpose of number use (if required);
* **receive\_sms** - 1 – SMS reception enabling (only if the number supports SMS reception);
* **period** - 'month' – one month, '3month' – three months (optional parameter, SMS reception can be enabled for numbers prepaid for at least three months);
* **autorenew\_period** - an optional parameter, renewal period (year, month), the subscription fee depends on it, default is month;
* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## post /v1/direct\_numbers/prolong/

prepay the number for the specified number of months

```
                                    {
    'status': 'success',
    'number': '+44000000000',
    'stop_date': '2021-05-01 12:00:00',
    'total_paid': {
        'amount': 2,
        'currency': 'USD'
    }
}
```

#### Parameters:

* **number** - number to be prolonged;
* **months** - number of months;
* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## put /v1/direct\_numbers/receive\_sms/

enable SMS reception (only if the number supports SMS reception)

```
                                    {
    "status": "success", 
    "number": "", 
    "receive_sms": "on"
}
```

#### Parameters:

* **number** - number
* **value** - value (can be "on" or "off")
* **documents\_group\_id** - optional parameter, account's document group ID
* **user\_id** - optional parameter, available for use only by dealers and only for those users created by them

## get /v1/direct\_numbers/incoming\_channels/

obtaining information about the possibility of increasing the number of incoming channels on a virtual number

```
                                    {
    "status": "success"
}
```

#### Parameters

**At least one of the parameters is required**

* **direction\_id** – ID of the direction/city;
* **number** – number.

**Optional**

* **currency** – cost in the desired currency;
* **user\_id** – available for use only by dealers and only for the users created by them.

## put /v1/direct\_numbers/incoming\_channels/

increasing the number of lines

```
                                    {
    "status": "success"
}
```

#### Parameters

* **number** – number;
* **channels** – number of channels;
* **user\_id** – optional parameter, available for use only by dealers and only for the users created by them.

## Groups of documents

## get /v1/documents/files

list of files/documents in the group of documents

```
                                    {
    "status": "success",
    "documents": [
        {
            "type": "passport",
            "is_verified": "true",
            "source": "upload",
            "name": "file1.jpg"
        },
        {
            "type": "receipt",
            "is_verified": "false",
            "source": "upload",
            "name": "file2.jpg"
        }
    ]
}
```

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them;
* **group\_id** - optional parameter, group of documents ID, (0 or not entered – main group of documents).

## get /v1/documents/groups/list/

list of groups of documents

```
                                    {
    "status": "success",
    "groups": [
        {
            "id": 0,
            "email": "email@server.com",
            "salutation": 'MR',
            "nationality": null,
            "first_name": "John",
            "middle_name": "Richard",
            "last_name": "Smith",
            "organization": "Company",
            "organization_description": null,
            "organization_reg_number": null,
            "country": "DE",
            "region": "",
            "city": "Berlin",
            "address": "Brudden Strasse 8, 76611",
            "zip_code": '76611',
            "street": 'Brudden Strasse',
            "street_code": null,
            "municipality_code": null,
            "building_number": "8",
            "building_letter": null,
            "phone": "4900000000",
            "type_of_id": "",
            "id_number": "123000099",
            "issuing_authority": null,
            "issuing_date": null,
            "is_readonly": true
        }
    ]
}
```

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## get /v1/documents/groups/get/<ID>/

information on a certain group

```
                                    {
    "status": "success",
    "group": {
        "id": 0,
        "email": "email@server.com",
        "salutation": 'MR',
        "nationality": null,
        "first_name": "John",
        "middle_name": "Richard",
        "last_name": "Smith",
        "organization": "Company",
        "organization_description": null,
        "organization_reg_number": null,
        "country": "DE",
        "region": "",
        "city": "Berlin",
        "address": "Brudden Strasse 8, 76611",
        "zip_code": '76611',
        "street": 'Brudden Strasse',
        "street_code": null,
        "municipality_code": null,
        "building_number": "8",
        "building_letter": null,
        "phone": "4900000000",
        "type_of_id": "",
        "id_number": "123000099",
        "issuing_authority": null,
        "issuing_date": null,
        "is_readonly": true
    }            
}
```

#### Parameters:

* **ID** - group ID, 0 – main group of documents;
* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## get /v1/documents/groups/valid/<ID>/

checking: whether the group of documents is suitable for a certain city/destination

```
                                    {
    "status": "success",
    "is_information_match": "true",
    "is_documents_uploaded": "true",
    "is_documents_verified": "true",
    "is_address_match": "true"
}
```

#### Parameters:

* **ID** - group ID, 0 – main group of documents;
* **user\_id** - optional parameter, only available for use for reseller and users created by them;
* **direction\_id** - destination/city ID.

## post /v1/documents/groups/create/

new group of documents creation

```
                                    {
    "status": "success",
    "group": {
        "id": 0,
        "email": "email@server.com",
        "salutation": 'MR',
        "nationality": null,
        "first_name": "John",
        "middle_name": "Richard",
        "last_name": "Smith",
        "organization": "Company",
        "organization_description": null,
        "organization_reg_number": null,
        "country": "DE",
        "region": "",
        "city": "Berlin",
        "address": "Brudden Strasse 8, 76611",
        "zip_code": '76611',
        "street": 'Brudden Strasse',
        "street_code": null,
        "municipality_code": null,
        "building_number": "8",
        "building_letter": null,
        "phone": "4900000000",
        "type_of_id": "",
        "id_number": "123000099",
        "issuing_authority": null,
        "issuing_date": null,
        "is_readonly": true
    }            
}
```

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them;
* **email** - email address;
* **salutation** - greeting 'MR', 'MS', 'COMPANY';
* **nationality** - nationality, country code iso2;
* **first\_name** - first name;
* **middle\_name** - optional parameter, middle name;
* **last\_name** - last name;
* **date\_of\_birth** - optional parameter, date of birth;
* **organization** - optional parameter, company name;
* **organization\_description** - optional parameter, company description;
* **organization\_reg\_number** - optional parameter, company registration number;
* **country** - country, country code iso2;
* **region** - optional parameter, region;
* **city** - city;
* **address** - full address;
* **zip\_code** - zip code;
* **street** - street;
* **street\_code** - optional parameter, street code, only for Denmark;
* **municipality\_code** - optional parameter, municipality code, only for Denmark;
* **building\_number** - building number;
* **building\_letter** - optional parameter, letter in the building number;
* **phone** - contact phone number;
* **type\_of\_id** - optional parameter, document type: "PASSPORT", "DNI", "NIE", "RESIDENCE\_PERMIT", "NATIONAL\_ID\_CARD", "BUSINESS\_REGISTRATION";
* **id\_number** - optional parameter, document number;
* **issuing\_authority** - optional parameter, issuing authority;
* **issuing\_date** - optional parameter, issuing date;
* **direction\_id** - optional parameter, destination/city ID for a compliance check.

## put /v1/documents/groups/update/<GROUPID>/

updating group of documents information

```
                                    {
    "status": "success",
    "group": {
        "id": 0,
        "email": "email@server.com",
        "salutation": 'MR',
        "nationality": null,
        "first_name": "John",
        "middle_name": "Richard",
        "last_name": "Smith",
        "organization": "Company",
        "organization_description": null,
        "organization_reg_number": null,
        "country": "DE",
        "region": "",
        "city": "Berlin",
        "address": "Brudden Strasse 8, 76611",
        "zip_code": '76611',
        "street": 'Brudden Strasse',
        "street_code": null,
        "municipality_code": null,
        "building_number": "8",
        "building_letter": null,
        "phone": "4900000000",
        "type_of_id": "",
        "id_number": "123000099",
        "issuing_authority": null,
        "issuing_date": null,
        "is_readonly": true
    }            
}
```

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them;
* **email** - email address;
* **salutation** - greeting 'MR', 'MS', 'COMPANY';
* **nationality** - nationality, country code iso2;
* **first\_name** - first name;
* **middle\_name** - optional parameter, middle name;
* **last\_name** - last name;
* **date\_of\_birth** - optional parameter, date of birth;
* **organization** - optional parameter, company name;
* **organization\_description** - optional parameter, company description;
* **organization\_reg\_number** - optional parameter, company registration number;
* **country** - country, country code iso2;
* **region** - optional parameter, region;
* **city** - city;
* **address** - full address;
* **zip\_code** - zip code;
* **street** - street;
* **street\_code** - optional parameter, street code, only for Denmark;
* **municipality\_code** - optional parameter, municipality code, only for Denmark;
* **building\_number** - building number;
* **building\_letter** - optional parameter, letter in the building number;
* **phone** - contact phone number;
* **type\_of\_id** - optional parameter, document type: "PASSPORT", "DNI", "NIE", "RESIDENCE\_PERMIT", "NATIONAL\_ID\_CARD", "BUSINESS\_REGISTRATION";
* **id\_number** - optional parameter, document number;
* **issuing\_authority** - optional parameter, issuing authority;
* **issuing\_date** - optional parameter, issuing date;
* **direction\_id** - optional parameter, destination/city ID for a compliance check.

## post /v1/documents/upload/

file upload for group of documents

#### Parameters:

* **user\_id** - optional parameter, only available for use for reseller and users created by them;
* **group\_id** - group ID, 0 – main group of documents;
* **document\_type** - document type: 'certificate', 'contract', 'company\_letter', 'inn\_ua', passport', 'phone\_bill', 'photo\_with\_doc', 'photo\_with\_passport', 'receipt', 'driver\_id\_us\_ca', 'driver\_id\_other';
* **file** - uploaded file.

#### Request example:

```
                                    $zd = new \Zadarma_API_Test\Api(KEY, SECRET);
$zd->request(
    'documents/upload',
    [
        'group_id' => 0,
        'document_type' => 'passport',
        'file' => new CURLFile('passport.jpg', 'image/jpeg', 'passport.jpg')
    ],
    'post'
);
```

#### Response example:

```
                                    {
    "status": "success",
    "message": "The File passport.jpg has been successfully uploaded to the website.",
    "doc_name": "passport.jpg"
}
```

## Reseller

## get /v1/reseller/account/info/

reseller account information

```
                                    {
    "status": "success",
    "balance": 123,
    "credit": 0,
    "currency": "USD",
    "reseller_fee": 10,
    "user_fee": 10
}
```

## post /v1/reseller/account/money\_transfer/

Transfer from reseller account balance to a connected account and back

```
                                    {
    "status": "success",
    "user": {
        "balance": "62.0000",
        "currency": "EUR"
    },
    "reseller": {
        "balance": "94.825",
        "currency": "USD"
    }
}
```

#### Parameters

* **amount** - amount;
* **currency** - currency;
* **type** - transfer direction "to\_reseller" and "to\_user".

## get /v1/reseller/users/phones/

List of user contact phone numbers

```
                                    {
    "status": "success",
    "list": [
        {
            "id": 0,
            "number": "49025000897",
            "is_proved": false
        }
    ]
}
```

#### Parameters

* **user\_id** - user id;

## post /v1/reseller/users/phones/add/

Adding user contact phone number

```
                                    {
    "status": "success",
    "id": 98,
    "number": "359000000001",
    "is_proved": true
}
```

#### Parameters

* **user\_id** - user id;
* **number** - number.

## post /v1/reseller/users/phones/update/

Editing user contact phone number

```
                                    {
    "status": "success",
    "id": 99,
    "number": "359000000002",
    "is_proved": false
}
```

#### Parameters

* **user\_id** - user id;
* **id** - number ID, 0 - main user phone number;
* **number** - number.

## post /v1/reseller/users/phones/prove\_by\_sms

User contact phone number confirmation request

```
                                    {
    "number": "359000000002",
    "status": "success",
    "message": "You were sent an SMS message with a code. Code is valid for 1 hour."
}
```

#### Parameters

* **user\_id** - user id;
* **number** - number;
* **confirm\_number\_reuse** - confirmation of the number that is used on another account (optional parameter)

## post /v1/reseller/users/phones/prove\_by\_callback

User's contact phone number confirmation request (a call will be made and when answered, the user will hear a confirmation code)

```
                                    {
    "number": "359000000002",
    "status": "success",
    "message": "You were sent an SMS message with a code. Code is valid for 1 hour."
}
```

#### Parameters:

* **user\_id** - required parameter, user id;
* **number** - required parameter, confirmed number (in international format)
* **caller\_id** - number displayed when calling, only numbers connected in the system are available;
* **language** - recitation language
* **sip\_id** - optional parameter, if not specified, takes the first available dealer's SIP,
* **confirm\_number\_reuse** - optional parameter, confirmation of the number that is used in another account

## post /v1/reseller/users/phones/confirm

Contact phone number confirmation via SMS

```
                                    {
    "status": "success",
    "message": "Your number confirmed!",
    "number": "35900000019"
}
```

#### Parameters

* **user\_id** - user id;
* **number** - number;
* **code** - confirmation code.

## post /v1/reseller/users/registration/new/

User registration

```
                                    {
    "status": "success",
    "user_id": 12345,
    "message": "You registered a new user in the system."
},{
    "status": "success",
    "message": "You registered a new user in the system. A registration confirmation link was sent to the email address you provided. To activate the account the user needs to click on that link, after which they can log in on the website."
},{
    "status": "success",
    "message": "You registered a new user in the system. A registration confirmation code was sent to the email address you provided. To activate the account the user needs to send code to you, after which you can confirm registration using API."
}
```

#### Parameters

* **email** - client email address;
* **first\_name** - client name;
* **last\_name** - optional parameter;
* **middle\_name** - optional parameter;
* **organization** - optional parameter;
* **country** - ISO2 country code;
* **city** - client city;
* **address** - optional parameter;
* **phone** - optional parameter;
* **password** - optional parameter;
* **tariff** - price plan ID (ID can be receive via method  [GET /v1/info/lists/tariffs/)](https://zadarma.com/en/support/api/#api_info_lists_tariffs) ;
* **tariff\_period** - optional parameter, price plan period month | year;
* **language** - optional parameter, language code, en;
* **currency** - optional parameter, currency code, USD;
* **promocode** - optional parameter, promotional code;
* **gmt** - optional parameter, GMT;
* **id\_card** - optional parameter, ID card number, passport.

## post /v1/reseller/users/registration/confirm/

User registration confirmation

```
                                    {
    "status": "success",
    "user_id": 12345
}
```

#### Parameters

* **code** - confirmation code from an email, sent to user's email address;
* **email** - email address.

## get /v1/reseller/users/list/

List of reseller users displayed per page (50 pc)

```
                                    {
    "status": "success",
    "total": 205,
    "total_pages": 5,
    "page": 1,
    "users": [
        {
            "id": "1234",
            "email": "test@domain.com",
            "first_name": "Test",
            "last_name": "Test",
            "organization": "",
            "phone": "+44000000001",
            "created": "2021-01-26 14:21:04",
            "last_login": "2021-01-30 09:46:31",
            "balance": "0.4000",
            "currency": "GBP",
            "sips_count": "1",
            "is_active": true,
            "allow_topup": true,
            "allow_api_requests": true
        },
        ...
    ]
}
```

#### Parameters

* **page** - page number.

## get /v1/reseller/users/find/

One account search by criterion (one of id, email, sip)

```
                                    {
    "status": "success",
    "user": {
        "id": "1234",
        "email": "test@domain.com",
        "first_name": "Test",
        "last_name": "Test",
        "organization": "",
        "phone": "+44000000001",
        "created": "2021-01-26 14:21:04",
        "last_login": "2021-01-30 09:46:31",
        "balance": "0.4000",
        "currency": "GBP",
        "sips_count": "1",
        "is_active": true,
        "allow_topup": true,
        "allow_api_requests": true
    }
}
```

#### Parameters

* **id** - optional;
* **sip** - optional;
* **email** - optional.

## post /v1/reseller/users/topup/

Transfer from reseller account balance to user account balance

```
                                    {
    "status": "success",
    "user_topup": {
        "amount": 10,
        "currency": "GBP"
    },
    "reseller_withdraw": {
        "amount": 10,
        "currency": "GBP"
    }
}
```

#### Parameters

* **user\_id** - user id;
* **amount** - amount;
* **currency** - currency.

## get /v1/reseller/users/api\_key/

Get current user access keys to API

```
                                    {
    "status": "success",
    "user_id": 1234,
    "last_request_datetime": "2021-02-18 10:45:01",
    "allow_reset": true,
    "key": "hidden",
    "secret": "hidden"
},{
    "status": "success",
    "user_id": 1234,
    "last_request_datetime": "2021-02-26 15:59:50",
    "allow_reset": false,
    "key": "abscd",
    "secret": "12345"
}
```

#### Parameters

* **user\_id** - user id.

## post /v1/reseller/users/api\_key/

Get new user access keys to API

```
                                    {
    "status": "success",
    "user_id": 1234,
    "key": "abscd",
    "secret": "12345"
}
```

#### Parameters

* **user\_id** - user id.

## SMS

## post /v1/sms/send/

sending SMS

```
                                    {
    "status":"success",
    "messages":1,
    "cost":0.24,
    "currency":"USD",
    "sms_detalization":[
        {
            "senderid":"xxxxxxxxxxx",
            "number":"1234567890",
            "cost":0.06
        }
    ],
    "denied_numbers":[
        {
            "number":"1234567890",
            "message":"The reason for the SMS not being sent to the number"
        }
    ]
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <value>
        <messages>1</messages>
        <cost>0.24</cost>
        <currency>1</currency>
        <sms_detalization>
            <value>
                <callerid>xxxxxxxxx</callerid>
                <number>1234567890</number>
                <cost>0.06</cost>
            </value>
        </sms_detalization>
        <denied_numbers>
            <value>
                <number>1234567890</number>
                <message>The reason for the SMS not being sent to the number</message>
            </value>
        </denied_numbers>
    </value>
</answer>
```

#### Parameters:

* **number** – phone number, where to send the SMS message (several numbers can be specified, separated by comma);
* **message** – message (standard text limit applies; the text will be separated into several SMS messages, if the limit is exceeded);
* **sender** – (optional) SMS sender (virtual number or text), the list of available values can be obtained using the method GET /v1/sms/senderid/
* **language** – (optional) SMS template language. If not specified, the language of the personal account is used.

## get /v1/sms/templates/

Getting a list of SMS templates

```
                                    {
"list": [
    {
        "cath_id":"1",
         "title":"The name of the template category",
        "templates": [
            {
                "id":"1",
                "text":"The template text with a variable {$var}"
            },
            {
                "id":"2",
                "text":"Second template text"
            },
        ]
    }
]
}
```

```
                                    <answer>
<list>
    <value>
        <cath_id>1</cath_id>
        <title>The name of the template category</title>
        <templates>
            <value>
                <id>1</id>
                <text>The template text with a variable {$var}</text>
            </value>
            <value>
                <id>2</id>
                <text>Second template text</text>
            </value>
        </templates>
    </value>
</list>
</answer>
```

#### Parameters

* **skip** – (optional) number of templates to skip before sampling, 0 by default;
* **limit** – (optional) number of templates to display (default 25, maximum 1000);
* **language** – (optional) language of general SMS templates. If not specified, the language of the personal account is used.

## get /v1/sms/senderid/

Get a list of valid SMS senders to a given number

```
                                    {
    "senders": ["Teamsale", "1234567890"]
}
```

```
                                    <answer>
	<senders>
		<value>1234567890</value>
		<value>Teamsale</value>
	</senders>
</answer>
```

#### Parameters

* **phones** – the phone number for which you want to get the list of allowed senders.

## WebRTC widget integration

## get /v1/webrtc/get\_key/

receive a key for the webrtc-widget. Key lifestime is 72 hours.

```
                                    {
    "status":"success",
    "key": YOUR_KEY
}
```

```
                                    <?xml version="1.0"?>
<answer>
    <status>success</status>
    <key>YOUR_KEY</key>
</answer>
```

**Parameters:**

* **sip** – SIP login or PBX extension.

## post /v1/webrtc/create/

WebRTC widget integration creation

```
                                    {
    "status": "success"
}
```

#### Parameters

* **user\_id** - optional parameter, only available for use for reseller and users created by them;
* **domain** - domain name.

## put /v1/webrtc/

WebRTC widget integration setting change

```
                                    {
    "status": "success"
}
```

#### Parameters

* **user\_id** - optional parameter, only available for use for reseller and users created by them;
* **shape** - widget shape, possible values: 'square', 'rounded';
* **position** - widget position, possible values: 'top\_left', 'top\_right', 'bottom\_right', 'bottom\_left'.

## get /v1/webrtc/

WebRTC widget integration information

```
                                    {
    "status": "success",
    "is_exists": true,
    "domains": [
        "test.domain.com"
    ],
    "settings": {
        "shape": "square",
        "position": "top_right"
    }
}
```

#### Parameters

* **user\_id** - optional parameter, only available for use for reseller and users created by them;

## post /v1/webrtc/domain/

Add a domain to WebRTC widget integration

```
                                    {
   "status": "success"
}
```

#### Parameters

* **user\_id** - optional parameter, only available for use for reseller and users created by them;
* **domain** - domain name.

## delete /v1/webrtc/domain/

Domain deletion from WebRTC widget integration

```
                                    {
   "status": "success"
}
```

#### Parameters

* **user\_id** - optional parameter, only available for use for reseller and users created by them;
* **domain** - domain name.

## delete /v1/webrtc/

WebRTC widget integration deletion

```
                                    {
   "status": "success"
}
```

#### Parameters

* **user\_id** - optional parameter, only available for use for reseller and users created by them.

## eSIM

## get /v1/esim/devices/

List of supported devices for eSIM

#### 

**Description of a successful response** (Response 1) 

```
                                    Response 1:  
{
    "status": "success",
    "devices": {
        "acer": [
            "ACER Swift 3",
            "ACER Swift 7"
        ],
        "asus": [
            "ASUS Mini Transformer T103HAF",
            "ASUS NovaGo TP370QL",
            "ASUS Vivobook Flip 14 TP401NA"
        ],
        "xiaomi": [
            "Xiaomi 12T Pro",
            "Xiaomi 13 Lite"
        ]
    }
}
```

* **devices** (оbject[]) — A list of devices grouped by brand

#### 

**Description of the response in case of an internal error** (Response 2) 

```
                                    Response 2:  
{
  "status": "error",
  "message": "Getting devices internal error"
}
```

* **message** (string) — сontains an error message

## get /v1/esim/packages/

List of all available packages

#### 

**Description of a successful response** (Response 1) 

```
                                    Response 1:  
{
  "status": "success",
  "packages": [
    {
      "duration": 7,
      "countries": [
        {
          "iso2": "cn",
          "name": "China",
          "aliases": []
        }
      ],
      "networks": [
        {
          "iso2": "CN",
          "network": "China Unicom",
          "type": "LTE"
        }
      ],
      "region": null,
      "id": "1-cn-7days-1gb",
      "price": 5,
      "data": 1,
      "duration_unit": "days",
      "data_unit": "GB",
      "top_up": true,
      "kyc_verify": false,
      "activation_policy": "first-usage",
      "activation_limit_days": null,
      "price_multi_currency": {
        "eur": 5,
        "usd": 5,
        "gbp": 4,
        "pln": 19,
        "kzt": 2000,
        "uah": 200
      },
    }
  ]
}
```

* **packages** (object[]) — contains a list of available packages
* **packages.\*.duration** (integer) — eSIM validity period. The unit of measurement for the value is contained in the parameter **duration\_unit**
* **packages.\*.countries** (object[]) — list of countries where eSIM service is available
* **packages.\*.networks** (object[]) — list of countries where mobile internet via eSIM is available
* **packages.\*.region** (null|string, europe|america|latin-america|asia|caribbean-islands|africa|south-africa|middle-east|oceania|iberica|scandinavia|eastern-europe) — region where eSIM is available
* **packages.\*.id** (string) — internal identifier of the eSIM
* **packages.\*.price** (float) — eSIM price
* **packages.\*.data** (integer) — available data volume. Единица the unit of measurement for this value is contained in the parameter **data\_unit**
* **packages.\*.duration\_unit** (string, days) — the unit of measurement for the validity period is contained in the parameter **duration**
* **packages.\*.data\_unit** (string, GB|KB|MB) — the unit of measurement for the traffic is contained in the parameter **data**
* **packages.\*.top\_up** (boolean) — true if eSIM is available for top-up
* **packages.\*.kyc\_verify** (boolean) — indicator of the document verification requirement for purchasing eSIM
* **packages.\*.activation\_policy** (null|string, first-usage|installation) — activation policy. If the value is "first-usage", It is activated at the moment of the first use. If the value is "installation" it is activated at the moment the eSIM is installed on the device. If null, it means there is no activation policy
* **packages.\*.price\_multi\_currency** (object) — an object of prices in each currency
* **packages.\*.activation\_limit\_days** (null|integer) — It may contain the number of days within which the eSIM must be activated after connection. If null, there is no such restriction

#### 

**Description of the response in case of an internal error** (Response 2) 

```
                                    Response 2:  
{
  "status": "error",
  "message": "Getting packages error"
}
```

* **message** (string) — contains an error message

## get /v1/esim/order/

List of connected packages

**Parameters**

* **user\_id** (integer)  
  Optional field  
  The ID of the requested user. This is only available for use by dealers and only for users created by them. By default, the current user ID will be used

#### 

**Description of a successful response** (Response 1) 

```
                                    Response 1:  
{
  "status": "success",
  "orders": [
    {
      "iccid": "8937204017175532566",
      "status": "inactive",
      "packages": [
        {
          "iccid": "8937204017175532566",
          "price": 4.5,
          "currency": "USD",
          "countries": [
            {
              "iso2": "al",
              "name": "Albania",
              "aliases": []
            }
          ],
          "duration": 30,
          "data": 1,
          "region": null,
          "id": "3-al-30days-1gb",
          "data_remaining": 1,
          "top_up": true,
          "created_at": 1730978058,
          "auto_prolong": false,
          "activated_at": null,
          "expired_at": null,
          "reference_id": "672ca10a84a28e977c0cfe39"
        }
      ],
      "title": null,
      "msisdn": null,
      "activation_code": "LPA:1$smdp.io$K2-2627GZ-1UM3Z3Y",
      "created_at": 1730978058
    }
  ]
}
```

* **orders** (оbject[]) — A list of connected packages. For a detailed description of the package data, refer to the method [**/v1/esim/order/<iccid>/**](#api_esim_order)

#### 

**Description of the response in case of an incorrect user\_id** (Response 2) 

```
                                    Response 2:  
{
    "status": "error",
    "message": "You are not a reseller of the requested user"
}
```

* **message** (string) — contains an error message

## get /v1/esim/order/<iccid>/

Information about the connected package by ICCID

**Parameters**

* **iccid** (string)   
  Required field  
  Requested ICCID
* **user\_id** (integer)  
  Optional field  
  The ID of the requested user. It is only available for use by dealers and only for users who were created by them. By default, the current user ID will be used

#### 

**Description of a successful response** (Response 1) 

```
                                    Response 1:  
{
  "status": "success",
  "order": {
    "iccid": "8937204017175532566",
    "status": "inactive",
    "packages": [
      {
        "iccid": "8937204017175532566",
        "price": 4.5,
        "currency": "USD",
        "countries": [
          {
            "iso2": "al",
            "name": "Albania",
            "aliases": []
          }
        ],
        "duration": 30,
        "data": 1,
        "type": "one-off",
        "region": null,
        "id": "3-al-30days-1gb",
        "data_remaining": 1,
        "top_up": true,
        "created_at": 1730978058,
        "auto_prolong": false,
        "activated_at": null,
        "expired_at": null,
        "reference_id": "672ca10a84a28e977c0cfe39"
      }
    ],
    "title": null,
    "msisdn": null,
    "activation_code": "LPA:1$smdp.io$K2-2627GZ-1UM3Z3Y",
    "created_at": 1730978058
  }
}
```

* **order.iccid** (string) — ICCID of the eSIM package
* **order.status** (string, active|inactive|archived|blocked) — Package status — activated, deactivated, archived, and blocked
* **order.packages** (object[]) — connected packages. The data for it is described in the method [**/v1/esim/esim/packages**](#api_esim_packages)
* **order.packages.\*.data\_remaining** (float) — available traffic volume. The unit of measurement for this value is contained in the parameter **order.packages.\*.data\_unit**
* **order.packages.\*.expired\_at** (null|integer) — timestamp if the eSIM has expired
* **order.title** (null|string) — username of the purchased eSIM
* **order.msisdn** (null|string) — MSISDN if it exists
* **order.activation\_code** (string) — key for generating the QR code or manual setup
* **order.created\_at** (integer) — timestamp of the eSIM connection

#### 

**Description of the error response if a non-existent one is sent ICCID** (Response 2) 

```
                                    Response 2:  
{
  "status": "error",
  "message": "Not found"
}
```

* **message** (string) — error message

## post /v1/esim/order/create/

Connect package

#### Parameters

* **package\_id** (string)  
  Required field  
  package ID for connection, **packages.\*.id** from the method [**/v1/esim/packages/**](#api_esim_packages)
* **user\_id** (integer)  
  Optional field  
  User D ID for connection. This is only available for use by dealers and only for users that have been created by them. By default, the current user ID will be used.

#### 

**Description of a successful response** (Response 1) 

```
                                    Response 1:  
{
    "status": "success",
    "order": {
        "iccid": "8937204016150824154",
        "activation_code": "LPA:1$smdp.io$K2-1UYQA7-Z8B3BF",
        "status": "inactive",
        "packages": [
            {
                "iccid": "8937204016150824154",
                "price": 11.01,
                "currency": "EUR",
                "countries": [
                    {
                        "iso2": "us",
                        "name": "США",
                        "aliases": []
                    }
                ],
                "duration": 30,
                "data": 0,
                "data_remaining": 0,
                "top_up": true,
                "type": "one-off",
                "region": "change",
                "created_at": 1720700977,
                "auto_prolong": false,
                "activated_at": null,
                "expired_at": null,
                "reference_id": null,
                "id": "3-change-30days-0gb"
            }
        ],
        "created_at": 1720700977,
        "title": null,
        "msisdn": null
    }
}
```

* **order** (оbject) — data about the connected package. A detailed description is provided in the method [**/v1/esim/order/<iccid>/**](#api_esim_order)

#### 

**Description of the error response in case of insufficient balance** (Response 2) 

```
                                    Response 2:  
{
  "status": "error",
  "message": "Not enough money on your account"
}
```

* **message** (string) — contains an error message

## Verify

## post /v1/verify/

Request for verification with a notification sent to the user

The verification request's lifespan is 10 minutes.

#### General parameters (for all channels)

* **channel** (string, sms|call\_code|email|call\_button)  
  Mandatory field  
  Channel for sending a message

#### 

#### Description of the "sms" channel

An SMS message with a confirmation code will be sent to the recipient's number.
Sending through this channel may require payment, so the API user must have a positive balance

**Parameters**

* **to** (string)  
  Mandatory field  
  The recipient's phone number in the format E.164
* **code** (integer)  
   Optional field  
  A six-digit verification code. If not provided, it is generated automatically
* **language** (string, en|es|de|pl|ru|ua|fr)  
   Optional field  
  Language of the message. If not specified, the user's language is used.
* **template\_id** (integer)  
  Optional field  
  User template ID for SMS. If not specified, the default template is used
* **caller\_id** (string)  
  Optional field  
  Sender's number. By default "Teamsale"

#### 

#### Description of the "call\_code" channel

When selecting this channel, a call is made to the recipient's number, during which the confirmation code is announced to the user. Sending through this channel may require payment, so the API user must have a positive balance

#### Requirements

To use this channel, the API user must have a registered number in the Zadarma system

**Parameters**

* **to** (string)  
  Mandatory field  
  Recipient's phone number in the format E.164
* **from** (string)  
  Optional field  
  The phone number in E.164 format from which the call will be made. Required if the user has more than one number in the Zadarma system
* **code** (integer)  
   Optional field  
  Six-digit verification code. If not provided, it is generated automatically
* **language** (string, en|es|de|pl|ru|ua|fr)  
   Optional field  
  Language of the message. If not specified, the user's language is used.

#### 

#### Description of the "email" channel

When using this channel, an email with a confirmation code is sent to the specified email address. To send through this channel, the API user must have email integration activated in the Teamsale CRM system

**Parameters**

* **to** (string)  
  Mandatory field  
  recipient's email address
* **from** (string)  
  Optional field  
  sender's email address. It is specified if the user has more than one email integration activated
* **code** (integer)  
   Optional field  
  Six-digit verification code. If not specified, it is generated automatically
* **language** (string, en|es|de|pl|ru|ua|fr)  
   Optional field  
  anguage of the message. If not specified, the user's language is used.
* **email\_subject** (string)  
  Optional field  
  Subject of the sent email. If the parameter is not specified, the default value is used
* **email\_body** (string)  
  Optional field  
  The body of the sent email. It must contain a line "{#code#}" for the automatic insertion of the confirmation code. If the parameter is not specified, the default value is used

#### 

#### Description of the "call\_button" channel

This channel involves a call to the recipient's number, during which the user must follow the instructions from the audio files and press the button **"1"** for confirmation. Sending through this channel may require payment, so the API user must have a positive balance

**To use this channel, the following is required**

* A phone number in the Zadarma system.
* An enabled PBX (virtual phone system).
* Configured [**event notifications**](#api_webhook_notify_out_end).

**Features:** the verification result through this channel is checked using [**NOTIFY\_OUT\_END webhook**](#api_webhook_notify_out_end), rather than the method [**/v1/verify/check/**](#api_verify_check).

**Parameters**

* **to** (string)  
  Mandatory field  
  Recipient's phone number in E.164 format
* **from** (string)  
  Optional field  
  The phone number in E.164 format from which the call will be made. Required if the user has more than one phone number in the PBX system
* **greeting\_sound\_id** (string)  
  Mandatory field  
  The ID of the audio file that the user will hear when answering the call
* **button\_1\_sound\_id** (string)  
  Mandatory field  
  The ID of the audio file that the user will hear after pressing the button **"1"**
* **fallback\_sound\_id** (string)  
  Mandatory field  
  The ID of the audio file that will be played if the user does not press the button **"1"**, presses a different button or does not take any action.

#### 

To manage the audio files used in the **greeting\_sound\_id**, **button\_1\_sound\_id** and **fallback\_sound\_id** parameters, use the API methods available in the section [**/v1/pbx/ivr/sounds/\***](#api_pbx_ivr_category).

#### 

#### Examples

When the request is successfully sent through the channels **sms**, **call\_code**, **email** (Response 1) 

```
                                    Response 1:  
{
    "status": "success",
    "request_id": "NDlLMWlNcW5mR3EvOFkraWVtOWF1Q2c9"
}
```

* **request\_id** (string) — The request ID, which will be required for the subsequent verification code check

#### 

When using the **call\_button** channel, a successful response does not contain **request\_id**, as the result is verified through [**NOTIFY\_OUT\_END webhook**](#api_webhook_notify_out_end) (Response 2) 

```
                                    Response 2:  
{
    "status": "success"
}
```

In case of an invalid request, the API returns a response with the status error and an error description in the **message** field (Response 3) 

```
                                    Response 3:  
{
    "status": "error",
    "message": "\"to\" param is required"
}
```

#### 

When sending a request through the **email** channel, if the **from** parameter is required but not specified, the system will return a response with the status **"error"** and a message indicating the missing required parameter (Response 4) 

```
                                    Response 4:  
{
    "status": "error",
    "message": "Can't find active email integration for the \"from\" param's email"
}
```

## post /v1/verify/check/

Verification of the code in the verification request for SMS, call\_code, and email channels

#### Parameters

* **code** (integer)  
  Mandatory field  
   The six-digit code that needs to be verified.
* **request\_id** (string)  
  Mandatory field  
  The request ID in which the code needs to be verified

#### 

**Description of a successful response if the code parameter matches the one in the verification request** (Response 1) 

```
                                    Response 1:  
{
    "status": "success",
    "message": "Code is correct"
}
```

* **status** (string) — contains the value "success"
* **message** (string) — contains the value "Code is correct"

#### 

**Description of the error response if the request is outdated or the request cannot be found by request\_id:** (Response 2) 

```
                                    Response 2:  
{
    "status": "error",
    "message": "No such request id"
}
```

* **message** (string) — сontains an error message

#### 

**Description of the error response if the code parameter does not match the one in the request** (Response 3) 

```
                                    Response 3:  
{
    "status": "error",
    "message": "Invalid verification code"
}
```

* **message** (string) — contains an error message

#### 

To verify the **call\_button** channel, you need to use the [**NOTIFY\_OUT\_END webhook**](#api_webhook_notify_out_end)

# Teamsale CRM methods

## Clients

## get /v1/zcrm/customers

Returns client list

**Parameters**

* **search** (optional) - search bar. Search is carried out in combination by:
  + client name
  + client phone numbers
  + client description
  + address and zip code
  + website
  + email address
  + messengers
  + employees’ names
  + employees’ phone numbers
  + employees’ description
  + employees’ email addresses
  + employees’ messengers
* **filter** (optional) - an object with client filters. The filter works only by the specified fields. Object structure:

**where:**

* **status** — client status. Valid values:
  + individual — personal user
  + company — company/business
* **type** — client type. Valid values:
  + potential — potential client
  + client — client
  + reseller — reseller
  + partner — partner
* **country** — client country. Two-letter code (US, UK etc.)
* **city** — client city (line)
* **label** — tag (identification)
* **employees\_count** — number of employees. Valid values:
  + 50 — less than 50
  + 50\_250 — 50 – 250
  + 250\_500 — 250 – 500
* **responsible** — responsible (user identification)

Any of the filter parameters can be skipped, meaning it is not required.

* **sort** (optional) - client sorting. Object structure:

**where:**

* **attr** — sorting field. Valid values:

  + name — client name
  + status — client status
  + type — client type
* **desc** — sorting direction. Valid values:

  + 0 — ascending
  + 1 — descending
* **take** (pagination) - how many clients to return (20 by default)
* **skip** (pagination) - how many clients to skip (0 by default)

**Response**

**where:**

* **totalCount** — total number of clients (including search and filter)
* **customers** — client array (including pagination). Each array element contains the following parameters:
  + **id** — client identification
  + **name** — client name
  + **status** — client status. Possible values:
    - individual — personal user
    - company — company/business
  + **type** — client type. Possible values:
    - potential — potential client
    - client — client
    - reseller — reseller
    - partner — partner
  + **responsible\_user\_id** — responsible (user identification)
  + **employees\_count** — number of employees. Possible values:
    - 50 — less than 50
    - 50\_250 — 50 – 250
    - 250\_500 — 250 – 500
  + **comment** — client description
  + **country** — client country. Two-letter code (UK, US etc.)
  + **city** — client city
  + **address** — client address
  + **zip** — zip code
  + **website** — client website
  + **created\_at** — client creation date and time (format YYYY-MM-DD HH:mm:ss)
  + **created\_by** — created by (user identification)
  + **lead\_source** — source. Possible values:
    - manual — manual
    - call\_incoming — incoming call
    - call\_outgoing — outgoing call
    - form — form
  + **lead\_created\_at** — lead creation date and time, if the client was created from a lead (format YYYY-MM-DD HH:mm:ss)
  + **lead\_created\_by** — lead created by, if the client was created from a lead (user identification)
  + **phones** — client phone numbers array. Each number contains the following fields:
    - type — number type. Possible values:
      * work — work
      * personal — personal
    - phone — phone number
  + **contacts** — client contacts array. Each contact contains the following fields:
    - **type** — contact type. Possible values:
      * email\_work — work e-mail
      * email\_personal — personal e-mail
      * skype
      * telegram
      * viber
      * whatsapp
    - **value** — contact value
  + **labels** — tags/labels array, assigned to a client. Each label contains the following fields:
    - id — label identification
    - label — label value
  + **utms** — source tags array. Each tag includes the following fields:
    - **id** — tag id
    - **param** — tag type. Possible values:
      * utm\_source
      * utm\_medium
      * utm\_campaign
      * utm\_content
      * phone
      * custom
    - **value** — actual tag value
    - **display\_value** — displayed tag value

## get /v1/zcrm/customers/<c\_id>

Returns client by ID

**Address parameters**

* **c\_id** — client identification

**Response**

```
                                    {
  "id": 65,
  "name": "Good Company",
  "status": "company",
  "type": "client",
  "responsible_user_id": 20,
  "employees_count": "50",
  "comment": "",
  "country": "GB",
  "city": "London",
  "address": "",
  "zip": "",
  "website": "",
  "created_at": "2020-04-28 05:47:47",
  "created_by": 20,
  "lead_source": "manual",
  "lead_created_at": null,
  "lead_created_by": null,
  "phones": [
    {
      "type": "work",
      "phone": "+44123456789"
    }
  ],
  "contacts": [
    {
      "type": "email_work",
      "value": "good_company@example.com"
    }
  ],
  "labels": [
    {
      "id": 12,
      "label": "Best clients"
    }
  ],
  "utms": [
    {
      "id": 19,
      "param": "utm_source",
      "value": "google",
      "display_value": "Google"
    }
  ],
  "custom_properties": [
    {
      "id": 18,
      "key": "loyalty",
      "title": "Loyalty",
      "value": "high"
    }
  ]
}
```

**where:**

* **id** — client identification
* **name** — client name
* **status** — client status. Possible values:
  + individual — personal user
  + company — company/business
* **type** — client type. Possible values:
  + potential — potential client
  + client — client
  + reseller — reseller
  + partner — partner
* **responsible\_user\_id** — responsible (user identification)
* **employees\_count** — number of employees. Possible values:
  + 50 — less than 50
  + 50\_250 — 50 – 250
  + 250\_500 — 250 – 500
* **comment** — client description
* **country** — client country. Two-letter code (UK, US etc.)
* **city** — client city
* **address** — client address
* **zip** — zip code
* **website** — client website
* **created\_at** — client creation date and time (format `YYYY-MM-DD HH:mm:ss`)
* **created\_by** — created by (user identification)
* **lead\_source** — source. Possible values:
  + manual — manual
  + call\_incoming — incoming call
  + call\_outgoing — outgoing call
  + form — form
* **lead\_created\_at** — lead creation date and time, if the client was created from a lead (format `YYYY-MM-DD HH:mm:ss`)
* **lead\_created\_by** — lead created by, if the client was created from a lead (user identification)
* **phones** — client phone numbers array. Each number contains the following fields:
  + **type** — number type. Possible values:
    - work — work
    - personal — personal
  + **phone** — phone number
* **contacts** — client contacts array. Each contact contains the following fields:
  + **type** — client type. Possible values:
    - email\_work — work e-mail
    - email\_personal — personal e-mail
    - skype
    - telegram
    - viber
    - whatsapp
  + **value** — contact value
* **labels** — tags/labels array, assigned to a client. Each label contains the following fields:
  + **id** — label identification
  + **label** — label value
  + **utms** — source tags array. Each tag includes the following fields:
    - **id** — tag id
    - **param** — tag type. Possible values:
      * utm\_source
      * utm\_medium
      * utm\_campaign
      * utm\_content
      * phone
      * custom
    - **value** — actual tag value
    - **display\_value** — displayed tag value
* **custom\_properties** — additional features array. Each additional feature contains the following fields:
  + **id** — additional feature identification
  + **key** — additional feature unique name
  + **title** — additional feature displayed name
  + **value** — additional feature value

## post /v1/zcrm/customers

Creates a new client with indicated data

#### Parameters

* **customer** — an object with the parameters of a new client. Object structure:

  (Response 1) 

  ```
                                      Response 1:  
  {
    "customer": {
      "name": "Good Company",
      "status": "company",
      "type": "client",
      "responsible_user_id": 20,
      "employees_count": "50",
      "comment": "",
      "country": "GB",
      "city": "London",
      "address": "",
      "zip": "",
      "website": "",
      "lead_source": "manual",
      "phones": [
        {
          "type": "work", 
          "phone": "+44123456789"
        }
      ],
      "contacts": [
        {
          "type": "email_work",
          "value": "good_company@example.com"
        }
      ],
      "labels": [
        { "id": 12 },
        { "id": 13 }
      ],
      "utms": [
        { "id": 19 },
        { "id": 20 }
      ],
      "custom_properties": [
        {
          "id": 18,
          "value": "high"
        }
      ]
  }
  }
  ```

  **where:**
* **name** — client name
* **status** — client status. Possible values:

  + individual — personal user
  + company — company/business
* **type** — client type. Possible values:

  + potential — potential client
  + client — client
  + reseller — reseller
  + partner — partner
* **responsible\_user\_id** — responsible (user identification)
* **employees\_count** — number of employees. Possible values:

  + 50 — less than 50
  + 50\_250 — 50 – 250
  + 250\_500 — 250 – 500
* **comment** — client description
* **country** — client country. Two-letter code (UK, US etc.)
* **city** — client city
* **address** — client address
* **zip** — zip code
* **website** — client website
* **lead\_source** — source. Possible values:

  + manual — вручную
  + call\_incoming — incoming call
  + call\_outgoing — outgoing call
  + form — form
* **phones** — phone numbers array. Each number contains the following fields:

  + **type** — number type. Possible values:
    - work — work
    - personal — personal
  + **phone** — number value
* **contacts** — client contacts array. Each contact contains the following fields:

  + **type** — contact type. Possible values:
    - email\_work — work e-mail
    - email\_personal — personal e-mail
    - skype
    - telegram
    - viber
    - whatsapp
  + **value** — contact value
* **labels** — tags/labels array, assigned to a client. Each label contains the following fields:

  + **id** — existing label identification
  + **utms** — source tags array. Each tag includes the following fields:
    - **id** — existing tag id
* **custom\_properties** — additional features array. Each element must contain:

  + **id** — additional feature identification:
  + **key** — additional feature unique name
  + **value** — additional feature value

#### Response:

(Response 2) 

```
                                    Response 2:  
{
  "id": 65
}
```

**where:**

* **id** — created client identification

## put /v1/zcrm/customers/<c\_id>

Updates an existing client with indicated ID

#### Address parameters

* **c\_id** — client identification

#### Parameters

* **customer** — an object with new client data. Object structure:

  ```
                                      {
    "customer": {
      "name": "Good Company",
      "status": "company",
      "type": "client",
      "responsible_user_id": 20,
      "employees_count": "50",
      "comment": "",
      "country": "GB",
      "city": "London",
      "address": "",
      "zip": "",
      "website": "",
      "lead_source": "manual",
      "phones": [
        {
          "type": "work",
          "phone": "+44123456789"
        }
      ],
      "contacts": [
        {
          "type": "email_work",
          "value": "good_company@example.com"
        }
      ],
      "labels": [
        { "id": 12 },
        { "id": 13 }
      ],
      "utms": [
        { "id": 19 },
        { "id": 20 }
      ],
      "custom_properties": [
        {
          "id": 18,
          "value": "high"
        }
      ]
  }
  }
  ```

  **where:**
* **name** — client name
* **status** — client status. Possible values:

  + individual — personal user
  + company — company/business
* **type** — client type. Possible values:

  + potential — potential client
  + client — client
  + reseller — reseller
  + partner — partner
* **responsible\_user\_id** — responsible (user identification)
* **employees\_count** — number of employees. Possible values:

  + 50 — less than 50
  + 50\_250 — 50 – 250
  + 250\_500 — 250 – 500
* **comment** — client description
* **country** — client country. Two-letter code (UK, US etc.)
* **city** — client city
* **address** — client address
* **zip** — zip code
* **website** — client website
* **created\_at** — client creation date and time (format YYYY-MM-DD HH:mm:ss)
* **created\_by** — created by (user identification)
* **lead\_source** — source. Possible values:

  + manual — manual
  + call\_incoming — incoming call
  + call\_outgoing — outgoing call
  + form — form
* **phones** — phone number array. Each number must contain the following fields:

  + **type** — number type. Possible values:
    - work — work
    - personal — personal
  + **phone** — phone number value
* **contacts** — client contacts array. Each contact contains the following fields:

  + type — contact type. Possible values:
    - email\_work — work e-mail
    - email\_personal — personal e-mail
    - skype
    - telegram
    - viber
    - whatsapp
  + value — contact value
* **labels** — tags/labels array, assigned to a client. Each label contains the following fields:

  + id — label identification
  + label — label value
  + **utms** — source tags array. Each tag includes the following fields:
    - **id** — existing tag id
* **custom\_properties** — additional features array. Each element must contain:

  + **id** — additional features identification or
  + **key** — additional features unique name
  + **value** — additional features values

## delete /v1/zcrm/customers/<c\_id>

Deleted a client by its ID

**Address parameters**

* **c\_id** — client identification

## Source tags

## get /v1/zcrm/customers/utms

Returns the array of all source tags and their statistics

#### Response

```
                                    [
  {
    "id": 78,
    "param": "utm_source",
    "value": "google",
    "display_value": "Google",
    "count": 1267
  }
]
```

Where each source tag includes the following fields:

* **id** — source tag id
* **param** — source tag type. Possible values:
  + utm\_source
  + utm\_medium
  + utm\_campaign
  + utm\_content
  + phone
  + custom
* **value** — actual source tag value
* **display\_value** — displayed source tag value
* **count** — number of clients and leads using this source tag

## post /v1/zcrm/customers/utms

Creates new source tag

#### Parameters

* **utm** — an object with data for a new source tag. Object structure:
  (Response 1) 

  ```
                                      Response 1:  
  {
    "utm": {
    "param": "utm_source",
    "value": "google",
    "display_value": "Google"
  }
  }
  ```

  **Where:**
* **param** — source tag type. Possible values:

  + utm\_source
  + utm\_medium
  + utm\_campaign
  + utm\_content
  + phone
  + custom
* **value** — actual source tag value
* **display\_value** (optional) — displayed source tag value

#### Response

(Response 2) 

```
                                    Response 2:  
{
  "id": 78
}
```

**Where:**

* **id** — id of the created source tag

## put /v1/zcrm/customers/utms/<utm\_id>

Updates an existing source tag with the specified ID

#### Address parameters

* **utm\_id** — source tag id

#### Parameters

* **utm** — an object with data for a new source label. Object structure:

```
                                    {
  "utm": {
  "param": "utm_source",
  "value": "google",
  "display_value": "Google"
}
}
```

Where:

* **param** — source tag type. Possible values:
  + utm\_source
  + utm\_medium
  + utm\_campaign
  + utm\_content
  + phone
  + custom
* **value** — actual source tag value
* **display\_value** — displayed source tag value

## delete /v1/zcrm/customers/utms/<utm\_id>

Deletes call tracking tag from the system by its ID

#### Address parameters

* **utm\_id** — source tag id

## Labels

## get /v1/zcrm/customers/labels

Returns the list of all labels and their statistics

**Response**

```
                                    {
  "totalCount": 5,
  "labels": [
    {
      "id": 12,
      "label": "Best clients",
      "count": 14
    }
  ]
}
```

**where:**

* **totalCount** — total number of labels in the system
* **labels** — labels array. Each label has the following fields:
  + **id** — label identification
  + **label** — label name
  + **count** — number of clients and leads using this label

## post /v1/zcrm/customers/labels

Creates new label

**Parameters**

* **name** — new label name

**Response**

```
                                    {
  "id": 13,
  "label": "Very best clients",
  "count": 0
}
```

**where:**

* **id** — created label identification
* **label** — label name
* **count** — number of clients and leads using this label (here always equals 0)

## delete /v1/zcrm/customers/labels/<l\_id>

Deletes label from the system using its ID

**Address parameters**

* **l\_id** — label identification

## Additional features

## get /v1/zcrm/customers/custom-properties

Returns additional features

**Response**

```
                                    {
  "totalCount": 8,
  "customProperties": [
    {
      "id": 18,
      "key": "loyalty",
      "title": "Loyalty"
    }
  ]
}
```

**where:**

* **totalCount** — total number of additional features.
* **customProperties** — array of additional features. Each additional feature includes the following fields:
  + **id** — additional feature identification
  + **key** — additional feature unique name
  + **title** — additional feature displayed name

## Client timeline

## get /v1/zcrm/customers/<c\_id>/feed

Returns records in client timeline

**Address parameters**

* **c\_id** — client identification

**Response**

```
                                    {
  "totalCount": 17,
  "items": [
    {
      "id": 37825,
      "type": "note",
      "content": "Call to the client",
      "time": "2020-06-08 06:55:02",
      "user_id": 20,
      "user_name": "John Beam",
      "call_id": null,
      "call_type": null,
      "call_status": null,
      "call_phone": null,
      "call_duration": null,
      "call_record": null,
      "call_contact_name": null,
      "attached_files": [
        {
          "file_id": 576,
          "original_filename": "document.doc"
        }
      ]
    }
  ]
}
```

**where:**

* **totalCount** — total number of records
* **items** — records array. Each record contains the following attributes:
  + **id** — records identification
  + **type** — record type. Possible values:
    - event — event
    - note — text note
    - call — call
  + **content** — content. If record type is note, this attribute contains note text. If record type is event, this attribute contains event identification, for example:
    - CUSTOMER\_CREATED — client creation event
    - LEAD\_CREATED — lead creation event
  + **time** — record time in format `YYYY-MM-DD hh:mm:ss`
  + **user\_id** — user identification, who created the record
  + **user\_name** — user name, who created the record
  + **call\_id** — call identification (if record type is call)
  + **call\_type** — call type. Possible values:
    - incoming — incoming call
    - outgoing — outgoing call
  + **call\_status** — call status. Possible values:
    - answer — successful call
    - noanswer — no answer
    - cancel — canceled
    - busy — busy
    - failed — failed call
  + **call\_phone** — call phone number
  + **call\_duration** — call duration in seconds
  + **call\_record** — if call recording is enabled
  + **call\_contact\_name** — call contact name
  + **attached\_files** — array of files attached to a note (if record type is a note). Each array element contains the following attributes:
    - **file\_id** — file identification
    - **original\_filename** — original file name

## post /v1/zcrm/customers/<c\_id>/feed

Adds a text note to client timeline with an ability to attach files

**Address parameters**

* **c\_id** — client identification

**Parameters**

* **content** — note text content
* **files** — attached files array

**Response**

```
                                    {
  "id": 37825,
  "type": "note",
  "content": "Call to the client",
  "time": "2020-06-08 06:55:02",
  "user_id": 20,
  "user_name": "John Beam",
  "attached_files": [
    {
      "file_id": 576,
      "original_filename": "document.doc"
    }
  ]
}
```

**where:**

* **id** — record identification
* **type** — record type. In this case is equal to:
  + note — text note
* **content** — note text content
* **time** — record time in format `YYYY-MM-DD hh:mm:ss`
* **user\_id** — user identification, who created a record
* **user\_name** — user name, who created a record
* **attached\_files** — array of files attached to a note (if record type is a note). Each array element contains the following attributes:
  + **file\_id** — file identification
  + **original\_filename** — original file name

## put /v1/zcrm/customers/<c\_id>/feed/<i\_id>

Updates an existing text note by its ID

**Address parameters**

* **c\_id** — client identification
* **i\_id** — text note identification

**Parameters**

* **content** — new note text

## delete /v1/zcrm/customers/<c\_id>/feed/<i\_id>

Deletes a note in client timeline by its ID

**Address parameters**

* **c\_id** — client identification
* **i\_id** — note identification

## Employees

## get /v1/zcrm/customers/<c\_id>/employees

Returns client employees list by its ID

**Address parameters**

* **c\_id** — client identification

**Response**

```
                                    {
  "totalCount": 5,
  "employees": [
    {
      "id": 23,
      "customer_id": 11,
      "name": "Steven Knight",
      "position": "manager",
      "position_title": "",
      "comment": "",
      "phones": [
        {
          "type": "work",
          "phone": "+44123456789"
        }
      ],
      "contacts": [
        {
          "type": "email_work",
          "value": "s.knight@example.com"
        }
      ]
    }
  ]
}
```

**where:**

* **totalCount** — number of client’s employees
* **employees** — client’s employees array. Each array element contains the following attributes:
  + **id** — employee identification
  + **customer\_id** — client identification to whom the employee is attached
  + **name** — employee name
  + **position** — employee position. Possible values:
    - ceo — CEO
    - director — director
    - manager — manager
    - sales\_manager — sales manager
    - hr — HR
    - support — support
    - custom — custom
  + **position\_title** — custom position title (for position = custom)
  + **comment** — employee description
  + **phones** — employee phone numbers array. Each number includes the following fields:
    - **type** — number type. Possible value:
      * work — work
      * personal — personal
    - **phone** — phone number value
  + **contacts** — employee contacts array. Each contact contains the following field:
    - **type** — contact type. Possible values:
      * email\_work — work e-mail
      * email\_personal — personal e-mail
      * skype
      * telegram
      * viber
      * whatsapp
    - **value** — contact value

## get /v1/zcrm/customers/<c\_id>/employees/<e\_id>

Returns client employee by its ID

**Address parameters**

* **c\_id** — client identification
* **e\_id** — employee identification

**Response**

```
                                    {
  "id": 23,
  "customer_id": 11,
  "name": "Steven Knight",
  "position": "manager",
  "position_title": "",
  "comment": "",
  "phones": [
    {
      "type": "work",
      "phone": "+44123456789"
    }
  ],
  "contacts": [
    {
      "type": "email_work",
      "value": "s.knight@example.com"
    }
  ]
}
```

**where:**

* **id** — employee identification
* **customer\_id** — client identification to whom the employee is attached
* **name** — employee name
* **position** — employee position. Possible values:
  + ceo — CEO
  + director — director
  + manager — manager
  + sales\_manager —sales manager
  + hr — HR
  + support — support
  + custom — custom
* **position\_title** — custom position title (for position = custom)
* **comment** — employee description
* **phones** — employee phone number array. Each number contains the following field:
  + **type** — number type. Position values:
    - work — work
    - personal — personal
  + **phone** — phone number value
* **contacts** — employee contacts array. Each contact contains the following fields:
  + **type** — contact type. Possible values:
    - email\_work — work e-mail
    - email\_personal — personal e-mail
    - skype
    - telegram
    - viber
    - whatsapp
  + **value** — contact value

## post /v1/zcrm/customers/<c\_id>/employees

Creates and saves a new employee for a chosen client

**Address parameters**

* **c\_id** — client identification

**Parameters**

* **employee** — an object with data for a new employee. Object structure:
  (Response 1) 

  ```
                                      Response 1:  
  {
    "employee": {
      "name": "Steven Knight",
      "position": "manager",
      "position_title": "",
      "comment": "",
      "phones": [
        {
          "type": "work",
          "phone": "+44123456789"
        }
      ],
      "contacts": [
        {
          "type": "email_work",
          "value": "s.knight@example.com"
        }
      ]
  }
  }
  ```

  **where:**
* **name** — employee name
* **position** — employee position. Possible values:

  + ceo — CEO
  + director — director
  + manager — manager
  + sales\_manager — sales manager
  + hr — HR
  + support — support
  + custom — custom
* **position\_title** — custom position title (for **position** = custom)
* **comment** — employee description
* **phones** — employee phone number array. Each number contains the following field:

  + **type** — phone number. Possible values:
    - work — work
    - personal — personal
  + **phone** — phone number value
* **contacts** — employee contacts array. Each contact contains the following fields:

  + **type** — contact type. Possible values:
    - email\_work — work e-mail
    - email\_personal — personal e-mail
    - skype
    - telegram
    - viber
    - whatsapp
  + **value** — contact value

**Response**
(Response 2) 

```
                                    Response 2:  
{
  "id": 23
}
```

**where:**

* **id** — new employee identification

## put /v1/zcrm/customers/<c\_id>/employees/<e\_id>

Updates an existing employee with an indicated ID

**Address parameters**

* **c\_id** — client identification
* **e\_id** — employee identification

**Parameters**

* **employee** — new employee information. Structure:

```
                                    {
  "employee": {
    "name": "Steven Knight",
    "position": "manager",
    "position_title": "",
    "comment": "",
    "phones": [
      {
        "type": "work",
        "phone": "+44123456789"
      }
    ],
    "contacts": [
      {
        "type": "email_work",
        "value": "john@example.com"
      }
    ]
}
}
```

**where:**

* **name** — employee name
* **position** — employee position. Possible values:
  + ceo — CEO
  + director — director
  + manager — manager
  + sales\_manager — sales manager
  + hr — HR
  + support — support
  + custom — custom
* **position\_title** — custom position title (for **position** = custom)
* **comment** — employee description
* **phones** — employee phone number array. Each number contains the following field:
  + **type** — phone number. Possible values:
    - work — work
    - personal — personal
  + **phone** — phone number value
* **contacts** — employee contacts array. Each contact contains the following fields:
  + **type** — contact type. Possible values:
    - email\_work — work e-mail
    - email\_personal — personal e-mail
    - skype
    - telegram
    - viber
    - whatsapp
  + **value** — contact value

## delete /v1/zcrm/customers/<c\_id>/employees/<e\_id>

Deletes an employee by ID

**Address parameters**

* **c\_id** — client identification
* **e\_id** — employee identification

## Leads

## get /v1/zcrm/leads

Returns lead list

**Parameters**

* **search** (optional) - search bar. Search is carried out in combination by:

  + lead name
  + lead phone number
  + lead description
  + address and zip code
  + website
  + email address
  + messengers
* **filter** (optional) - an object with lead filters. Object structure:
  (Response 1) 

  ```
                                      Response 1:  
  {
    "filter": {
      "source": "call_incoming",
      "responsible": 32,
      "label": 12,
      "utm": 19,
      "createdAfter": "2020-06-11 12:24:00",
      "createdBefore": "2020-06-26 12:24:00"
  }
  }
  ```

  **where**
* **source** — lead source. Possible values:

  + manual — manual
  + call\_incoming — incoming call
  + call\_outgoing — outgoing call
  + form — callback form
* **responsible** — responsible (user identification). The parameter also allows special values:

  + null — will return all leads assigned to someone
  + –1 — will return all raw leads
  + –2 — will return all leads (assigned and raw)
* **label** — label/tag (identification)

  + **utm** — source tag (identification)
* **createdAfter** — display only leads created **after** the specified time (format: `YYYY-MM-DD hh:mm:ss`)
* **createdBefore** — display only leads created **before** the specified time (format: `YYYY-MM-DD hh:mm:ss`)

Any of the filter parameters can be skipped, meaning it is not required.

* **sort** (optional) - lead sorting. Object structure:
  (Response 2) 

  ```
                                      Response 2:  
  {
    "sort": { 
      "attr": "name",
      "desc": 0
  }
  }
  ```

  **where**

  + **attr** — sorting field. Possible values:
  + name — lead name
  + lead\_source — lead source
  + lead\_status — lead status
  + responsible\_user\_id — responsible user
  + lead\_created\_at — lead creation time
  + **desc** — sorting order. Possible values:
  + 0 — ascending
  + 1 — descending
* **take** (pagination) - how many leads to return (20 by default)
* **skip** (pagination) - how many leads to skip (0 by default)

**Response**
(Response 3) 

```
                                    Response 3:  
{
  "totalCount": 100,
  "uncategorizedCount": 10,
  "leads": [
    {
      "id": 3486,
      "name": "Good Company",
      "responsible_user_id": 234,
      "employees_count": "50",
      "comment": "",
      "country": "GB",
      "city": "London",
      "address": "",
      "zip": "",
      "website": "",
      "lead_status": "not_processed",
      "lead_source": "manual",
      "lead_created_at": "2020-04-28 05:47:47",
      "lead_created_by": 234,
      "phones": [
        {
          "type": "work",
          "phone": "+44123456789"
        }
      ],
      "contacts": [
        {
          "type": "email_work",
          "value": "good_company@example.com"
        }
      ],
      "labels": [
        {
          "id": 22,
          "label": "Best clients"
        }
      ],
      "utms": [
        {
          "id": 19,
          "param": "utm_source",
          "value": "google",
          "display_value": "Google"
        }
      ]
    }
  ]
}
```

**where**

* **totalCount** — total number of found leads (including search bar and filter)
* **uncategorizedCount** — total number of raw leads (including search bar and filter)
* **leads** — lead array (including pagination). Each array element contains the following parameters:
  + **id** — lead identification
  + **name** — lead name
  + **responsible\_user\_id** — responsible (user identification)
  + **employees\_count** — number of employees. Possible values:
    - 50 —less than 50
    - 50\_250 — 50 – 250
    - 250\_500 — 250 – 500
  + **comment** — lead description
  + **country** — lead county. Two-letter code (UK, US etc.)
  + **city** — lead city
  + **address** — lead address
  + **zip** — zip code
  + **website** — lead website
  + **lead\_status** — lead status. Possible values:
    - not\_processed — not processed
    - in\_progress — in progress
    - finished — finished
  + **lead\_source** — lead source. Possible values:
    - manual — manual
    - call\_incoming — incoming call
    - call\_outgoing — outgoing call
    - form —form
  + **lead\_created\_at** — lead creation date and time (in format `YYYY-MM-DD HH:mm:ss`)
  + **lead\_created\_by** — who created the lead (user identification)
  + **phones** — lead phone numbers array. Each number contains the following fields:
    - **type** — number type. Possible values:
      * work —work
      * personal — personal
    - **phone** — number value
  + **contacts** — lead contacts array. Each contact contains the following fields:
    - **type** — contact type. Possible values:
      * email\_work — work e-mail
      * email\_personal — personal e-mail
      * skype
      * telegram
      * viber
      * whatsapp
    - **value** — contact value
  + **labels** — array of leads assigned to a lead. Each label contains the following fields:
    - **id** — label identification
    - **label** — label value
  + **utms** — source tag array. Each tag includes the following fields:
    - **id** — tag id
    - **param** — tag type. Possible values:
      * utm\_source
      * utm\_medium
      * utm\_campaign
      * utm\_content
      * phone
      * custom
    - **value** — actual tag value
    - **display\_value** — displayed tag value

## get /v1/zcrm/leads/<lead\_id>

Returns lead by its ID

**Response**

```
                                    {
  "id": 3486,
  "name": "Good Company",
  "responsible_user_id": 234,
  "employees_count": "50",
  "comment": "",
  "country": "GB",
  "city": "London",
  "address": "",
  "zip": "",
  "website": "",
  "lead_status": "not_processed",
  "lead_source": "manual",
  "lead_created_at": "2020-04-28 05:47:47",
  "lead_created_by": 234,
  "phones": [
    {
      "type": "work",
      "phone": "+44123456789"
    }
  ],
  "contacts": [
    {
      "type": "email_work",
      "value": "good_company@example.com"
    }
  ],
  "labels": [
    {
      "id": 22,
      "label": "Best clients"
    }
  ],
  "utms": [
    {
      "id": 19,
      "param": "utm_source",
      "value": "google",
      "display_value": "Google"
    }
  ],
  "custom_properties": [
    {
      "id": 12,
      "key": "loyalty",
      "title": "Loyalty",
      "value": "high"
    }
  ]
}
```

**where**

* **id** — lead identification
* **name** — lead name
* **responsible\_user\_id** — responsible (user identification)
* **employees\_count** — number of employees. Possible values:
  + 50 — less than 50
  + 50\_250 — 50 – 250
  + 250\_500 — 250 – 500
* **comment** — lead description
* **country** — lead country. Two-letter code (UK, US etc.)
* **city** — lead city
* **address** — lead address
* **zip** — zip code
* **website** — lead website
* **lead\_status** — lead status. Possible values:
  + not\_processed — not processed
  + in\_progress — in progress
  + finished —finished
* **lead\_source** — lead source. Possible values:
  + manual — manual
  + call\_incoming — incoming call
  + call\_outgoing — outgoing call
  + form — form
* **lead\_created\_at** — lead creation date and time (in format `YYYY-MM-DD HH:mm:ss`)
* **lead\_created\_by** — who created the lead (user identification)
* **phones** — lead phone numbers array. Each number contains the following fields:
  + **type** — number type. Possible values:
    - work — work
    - personal — personal
  + **phone** — number value
* **contacts** — lead contacts array. Each contact contains the following fields:
  + **type** — contact type. Possible values:
    - email\_work — work e-mail
    - email\_personal — personal e-mail
    - skype
    - telegram
    - viber
    - whatsapp
  + **value** — contact value
* **labels** — array of labels assigned to a lead. Each label contains the following fields:
  + **id** — label identification
  + **label** — label value
  + **utms** — source tag array. Each tag includes the following fields:
    - **id** — tag id
    - **param** — tag type. Possible values:
      * utm\_source
      * utm\_medium
      * utm\_campaign
      * utm\_content
      * phone
      * custom
    - **value** — actual tag value
    - **display\_value** — displayed tag value

## post /v1/zcrm/leads

Creates a new lead with indicated information

**Parameters**

* **convert** — convert lead to client. Valid values:

  + 0 — don not convert, create a lead
  + 1 — create a client
  + 2 — poor (the action will be canceled – lead or client will not be created)
* **lead** — an object with data of a new lead. Object structure:
  (Response 1) 

  ```
                                      Response 1:  
  {
    "lead": {
      "name": "Good Company",
      "responsible_user_id": 234,
      "employees_count": "50",
      "comment": "",
      "country": "GB",
      "city": "London",
      "address": "",
      "zip": "",
      "website": "",
      "lead_source": "manual",
      "lead_status": "in_progress",
      "phones": [
        {
          "type": "work",
          "phone": "+44123456789"
        }
      ],
      "contacts": [
        {
          "type": "email_work",
          "value": "good_company@example.com"
        }
      ],
      "labels": [
        { "id": 22 },
        { "id": 23 }
      ],
      "utms": [
        { "id": 19 },
        { "id": 20 }
      ],
      "custom_properties": [
        {
          "id": 12,
          "value": "high"
        }
      ]
  }
  }
  ```

  **where**
* **name** — lead name
* **responsible\_user\_id** — responsible (user identification)
* **employees\_count** — number of employees. Valid values:

  + 50 — less than 50
  + 50\_250 — 50 – 250
  + 250\_500 — 250 – 500
* **comment** — lead description
* **country** — lead country. Two-letter code (UK, US etc.)
* **city** — lead city
* **address** — lead address
* **zip** — lead zip code
* **website** — lead website
* **lead\_source** — lead source. Valid values:

  + manual — manual
  + call\_incoming — incoming call
  + call\_outgoing — outgoing call
  + form —form
* **lead\_status** — lead status. Valid values:

  + not\_processed — not processed
  + in\_progress — in progress
  + finished — finished
* **phones** — phone number array. Each number must contain the following fields:

  + **type** — number type. Possible values:
    - work — work
    - personal — personal
  + **phone** — number value
* **contacts** — lead contacts array. Each contact must contain the following fields:

  + **type** — contact type. Possible values:
    - email\_work — work e-mail
    - email\_personal — personal e-mail
    - skype
    - telegram
    - viber
    - whatsapp
  + **value** — contact value
* **labels** — array of labels assigned to the lead. Each element must contain:

  + **id** — existing label identification
  + **utms** — source tag array. Each tag includes the following fields:
    - **id** — existing tag id
  + **custom\_properties** — additional features array. Each element must contain:
    - **id** — additional feature identification or:
    - **key** — additional feature unique name
    - **value** — additional feature value

**Response**
(Response 2) 

```
                                    Response 2:  
{
  "id": 123
}
```

**where**

* **id** — created lead identification

## put /v1/zcrm/leads/<lead\_id>

Updates an existing lead with an indicated ID

**Parameters**

* **convert** — convert lead to client. Valid values:
  + 0 — do not convert
  + 1 — create a client
  + 2 — poor (delete lead)
* **lead** — an object with new lead data. Object structure:

```
                                    {
  "lead": {
    "name": "Good Company",
    "responsible_user_id": 234,
    "employees_count": "50",
    "comment": "",
    "country": "GB",
    "city": "London",
    "address": "",
    "zip": "",
    "website": "",
    "lead_source": "manual",
    "lead_status": "in_progress",
    "phones": [
      {
        "type": "work",
        "phone": "+44123456789"
      }
    ],
    "contacts": [
      {
        "type": "email_work",
        "value": "good_company@example.com"
      }
    ],
    "labels": [
      { "id": 22 },
      { "id": 23 }
    ],
    "utms": [
      { "id": 19 },
      { "id": 20 }
    ],
    "custom_properties": [
      {
        "id": 12,
        "value": "high"
      }
    ]
}
}
```

**where**

* **name** — lead name
* **responsible\_user\_id** — responsible (user identification)
* **employees\_count** — number of employees. Valid values:
  + 50 — less than 50
  + 50\_250 — 50 – 250
  + 250\_500 — 250 – 500
* **comment** — lead description
* **country** — lead country. Two-letter code (UK, US etc.)
* **city** — lead city
* **address** — lead address
* **zip** — lead zip code
* **website** — lead website
* **lead\_source** — lead source. Valid value:
  + manual — manual
  + call\_incoming — incoming call
  + call\_outgoing — outgoing call
  + form — form
* **lead\_status** — lead status. Valid values:
  + not\_processed — not processed
  + in\_progress — in progress
  + finished — finished
* **phones** — phone numbers array. Each number must contain the following fields:
  + **type** — number type. Possible values:
    - work — work
    - personal — personal
  + **phone** — number value
* **contacts** — lead contacts array. Each contact must contain the following fields:
  + **type** — contact type. Possible values:
    - email\_work — work e-mail
    - email\_personal — personal e-mail
    - skype
    - telegram
    - viber
    - whatsapp
  + **value** — contact value
* **labels** — array of labels assigned to a lead. Each element must contain:
  + **id** — existing label identification
  + **utms** — source tag array. Each tag includes the following fields:
    - **id** — existing tag id
* **custom\_properties** — additional features array. Each element must contain:
  + **id** — additional features identification or:
  + **key** — additional features unique name
  + **value** — additional features value

## delete /v1/zcrm/leads/<lead\_id>

Deleted a lead by its ID

## Users

## get /v1/zcrm/users

Returns users list

**Response**

```
                                    {
  "totalCount": 2,
  "users": [
    {
      "id": 234,
      "email": "john@example.com",
      "name": "John Beam",
      "group_id": 653,
      "is_superadmin": 1,
      "enabled": 1,
      "created_at": "2020-04-27 01:01:31",
      "avatar": 2457,
      "role": "",
      "status": "",
      "language": "en",
      "color": "220",
      "color_hex": "5678BD",
      "internal_number": "100",
      "timezone": "Europe/London",
      "first_day": 1,
      "device": "webphone",
      "phone_widget_location": "right",
      "phones": [
        {
          "phone": "+44123456789",
          "type": "work"
        }
      ],
      "contacts": [
        {
          "type": "email_work",
          "value": "ivanov@example.com"
        }
      ]
    }
  ]
}
```

**where**

* **totalCount** — total number of users
* **users** — user array. Each array element contains the following attributes:
  + **id** — user identification
  + **email** — user account e-mail
  + **name** — user name
  + **group\_id** — user group identification
  + **is\_superadmin** — indicates if the user is a super-adminitrator (1 or 0)
  + **enabled** — if the user is unblocked (1 or 0)
  + **created\_at** — user creation date and time (in format `YYYY-MM-DD hh:mm:ss`)
  + **avatar** — user avatar (file identification)
  + **role** — user position
  + **status** — user status
  + **language** — user interface language. Possible values:
    - de — German
    - en — English
    - es — Spanish
    - pl — Polish
    - ru — Russian
    - ua — Ukranian
  + **color** — task color in Teamsale interface (only hue value — from 0 to 359)
  + **color\_hex** —task color in Teamsale (hex-presentation)
  + **internal\_number** — user PBX extension
  + **timezone** — user timezone
  + **first\_day** —indicates what week day is the beginning of the week:
    - 0 — Sunday
    - 1 — Monday
  + **device** — what is used for calls. Possible values:
    - webphone — webphone
    - softphone — third-party softphone
  + **phone\_widget\_location** — webphone widget location. Possible values:
    - left — display the widget on the left
    - right — display the widget on the right
  + **phones** — user phone numbers array. Each number contains the following fields:
    - **phone** — number value
    - **type** — number type. Possible values:
      * work — work
      * personal — personal
  + **contacts** — user contacts array. Each contact contains the following fields:
    - **type** — contact type. Possible values:
      * email\_work — work e-mail
      * email\_personal — personal e-mail
      * skype
      * telegram
      * viber
      * whatsapp
    - **value** — contact value

## get /v1/zcrm/users/<user\_id>

Returns user by its ID

**Response**

```
                                    {
  "id": 234,
  "email": "john@example.com",
  "name": "John Beam",
  "group_id": 653,
  "is_superadmin": 1,
  "enabled": 1,
  "created_at": "2020-04-27 01:01:31",
  "avatar": 2457,
  "role": "",
  "status": "",
  "language": "en",
  "color": "220",
  "color_hex": "5678BD",
  "internal_number": "100",
  "timezone": "Europe/London",
  "first_day": 1,
  "device": "webphone",
  "phone_widget_location": "right",
  "phones": [
    {
      "phone": "+44123456789",
      "type": "work"
    }
  ],
  "contacts": [
    {
      "type": "email_work",
      "value": "simpson@example.com"
    }
  ],
  "pending_email_change_request": false
}
```

**where**

* **id** — user identification
* **email** — user e-mail account
* **name** — user name
* **group\_id** — user group identification
* **is\_superadmin** — indicates if the user is a super-adminitrator (1 or 0)
* **enabled** — if the user is unblocked (1 or 0)
* **created\_at** — user creation date and time (in format `YYYY-MM-DD hh:mm:ss`)
* **avatar** — user avatar (file identification)
* **role** — user position
* **status** — user status
* **language** — user interface language. Possible values:
  + de — German
  + en — English
  + es — Spanish
  + pl — Polish
  + ru — Russian
  + ua — Ukranian
* **color** — task color in Teamsale interface (only hue value — from 0 to 359)
* **color\_hex** — task color in Teamsale (hex-presentation)
* **internal\_number** — user PBX extension
* **timezone** — user timezone
* **first\_day** — what week day is the beginning of the week:
  + 0 — Sunday
  + 1 — Monday
* **device** — what is used for calls. Possible values:
  + webphone — webphone
  + softphone — third-party softphone
* **phone\_widget\_location** — webphone widget location. Possible values:
  + left — display the widget on the left
  + right — display the widget on the right
* **phones** — an array of the user's phone numbers. Each number contains the following fields:
  + **phone** — the value of the number
  + **type** — type of number. Possible values:
    - work — work
    - personal — personal
* **contacts** — user phone numbers array. Each number contains the following fields:
  + **type** — contact type. Possible values:
    - email\_work — work e-mail
    - email\_personal — personal e-mail
    - skype
    - telegram
    - viber
    - whatsapp
  + **value** — contact value
* **pending\_email\_change\_request** —if account email change has been sent, but is not yet confirmed, this parameter will be set in true

## get /v1/zcrm/users/<user\_id>/working-hours

Returns user work hours

**Response**

```
                                    {
  "schedulePeriod": 7,
  "scheduleWorkingHours": [
    {
      "time_start": "2020-06-15 09:00:00",
      "time_end": "2020-06-15 18:00:00"
    }
  ],
  "scheduleFixes": [
    {
      "index": 2,
      "repeat_index": 1,
      "time_start": "2020-06-24 09:00:00",
      "time_end": "2020-06-24 13:00:00",
      "deleted": 0
    }
  ],
  "customWorkingHours": [
    {
      "time_start": "2020-06-27 11:00:00",
      "time_end": "2020-06-27 15:00:00"
    }
  ]
}
```

**where**

* **schedulePeriod** — schedule frequency, *how often* is it repeated. For a regular week it’s 7 days, for day-in day-out it’s 2 days etc.
* **scheduleWorkingHours** — work schedule array. Each work schedule contains the following attributes:
  + **time\_start** — beginning of work time in format `YYYY-MM-DD hh:mm:ss`
  + **time\_end** — end of work time in format `YYYY-MM-DD hh:mm:ss`
* **scheduleFixes** — array of changes entered during working periods indicated in parameter scheduleWorkingHours. Each array element contains the following attributes:
  + **index** — element index in scheduleWorkingHours, meaning what working period was changed
  + **repeat\_index** — schedule frequency index, in which the changes of future periods occur
  + **time\_start** — new beginning of working time in format `YYYY-MM-DD hh:mm:ss`
  + **time\_end** — new end of working time in format `YYYY-MM-DD hh:mm:ss`
  + **deleted** — if it equals 1, the working period is fully deleted
* **customWorkingHours** — array of custom, single working periods. Each working period contains the following attributes:
  + **time\_start** — beginning of work time in format `YYYY-MM-DD hh:mm:ss`
  + **time\_end** — end of work time in format `YYYY-MM-DD hh:mm:ss`

## get /v1/zcrm/users/groups

Returns groups and users rights in each of them

**Response**

```
                                    {
  "totalCount": 4,
  "groups": [
    {
      "id": 45,
      "type": "manager",
      "title": "",
      "permissions": {
        "customers_create": true,
        "customers_edit": true,
        "customers_delete": true,
        "customers_import_export": true,
        "customers_view_all": false,
        "calendar_other_users_access": false,
        "calls_other_users_access": false,
        "leads_view": false,
        "leads_edit": false,
        "leads_delete": false,
        "leads_import_export": false,
        "team_add": false,
        "team_edit": false
      }
    }
  ]
}
```

**where**

* **totalCount** — total number of groups
* **groups** — groups array. Each group contains the following attributes:
  + **id** — group identification
  + **type** — group type. Possible values:
    - admin — admins
    - manager — managers
    - chat\_operator — operators
    - trainee — trainees
    - custom — custom
  + **title** — custom group title ( or type = custom)
  + **permissions** — group user rights. Admins have a full access, that is why for admins this subject will be empty. Other groups contain the following attributes (each of them can be equal to `true` or `false`):
    - **customers\_create** — client creation allowed
    - **customers\_edit** — client editing allowed
    - **customers\_delete** — client deletion allowed
    - **customers\_import\_export** — client import and export allowed
    - **customers\_view\_all** — all client viewing is allowed, including the ones assigned by other users
    - **calendar\_other\_users\_access** — other users’ task viewing allowed
    - **calls\_other\_users\_access** — access to other users’ calls is allowed
    - **leads\_view** — only viewing of other users’ leads is allowed
    - **leads\_edit** — other users’ lead editing is allowed
    - **leads\_delete** — other users’ lead deletion is allowed
    - **leads\_import\_export** — lead export and import are allowed
    - **team\_add** — adding and inviting other users to the team is allowed
    - **team\_edit** — user editing is allowed

## Generalized contacts

## get /v1/zcrm/contacts

Returns the whole list of contacts (clients, employees, leads, users) with phone numbers

**Parameters**

* **search** (optional) - search bar. Search is carried out in combination by:
  + names and phone numbers of clients, leads, employees and users
  + users PBX extension
* **take** (pagination) - how many contacts to return (20 by default)
* **skip** (pagination) - how many contacts to skip (0 by default)

**Response**

(Response 1) 

```
                                    Response 1:  
{
  "totalCount": 128,
  "contacts": [
    {
      "contact_type": "customer",
    },
    {
      "contact_type": "employee",
    },
    {
      "contact_type": "lead",
    },
    {
      "contact_type": "user",
    }
  ]
}
```

**where**

* **totalCount** — total contact number (including search bar)
* **contacts** — contact array. Each of the contacts depending on its type (client, employee, lead, user) will have its own set of attributes.

**Clients**

(Response 2) 

```
                                    Response 2:  
{
    "contact_type": "customer",
    "id": 3486,
    "name": "Good Company",
    "status": "company",
    "type": "client",
    "phone": {
      "phone": "+44123456789",
      "type": "work"
    },
    "responsible": {
      "id": 234,
      "name": "John Beam",
      "ext_num": "100"
    }
}
```

**where**

* **contact\_type** — contact type:
  + customer —client
* **id** — client identification
* **name** — client name
* **status** — client status. Possible values:
  + individual — personal user
  + company — company/business
* **type** — client type. Possible values:
  + potential — potential client
  + client — client
  + reseller — reseller
  + partner — partner
* **phone** — phone number. Contains the following fields:
  + **phone** — the number itself
  + **type** — number type. Possible values:
    - work — work
    - personal — personal
* **responsible** — responsible user. Contains the following field:
  + **id** — user identification
  + **name** — user name
  + **ext\_num** — user PBX extension

**Client's employee**

(Response 3) 

```
                                    Response 3:  
{
    "contact_type": "employee",
    "id": 8,
    "name": "Michael Simpson",
    "phone": {
      "phone": "+44123456789",
      "type": "work"
    },
    "position": {
      "position": "manager",
      "title": ""
    },
    "customer": {
      "id": 3486,
      "name": "Good Company"
    },
    "responsible": {
      "id": 234,
      "name": "John Beam",
      "ext_num": "100"
    }
}
```

**where**

* **contact\_type** — contact type:
  + employee — employee
* **id** — employee identification
* **name** — employee name
* **phone** — phone number. Contains the following fields:
  + **phone** — the number itself
  + **type** — number type. Possible values:
    - work — work
    - personal — personal
* **position** — employee position. Contains the following dields:
  + **position** — position value. Possible values:
    - ceo — CEO
    - director — director
    - manager — manager
    - sales\_manager — sales manager
    - hr — HR
    - support — support
    - custom — custom
  + **title** — custom position title (for position = custom)
* **customer** — client to whom the employee is attached. Contains the following fields:
  + **id** — client identification
  + **name** — client name
  + **responsible** — user responsible for parent entity client. Contains the following fields:
    - **id** — user identification
    - **name** — user name
    - **ext\_num** — user PBX extension

**Lead**

(Response 4) 

```
                                    Response 4:  
{
    "contact_type": "lead",
    "id": 3486,
    "name": "Good Company",
    "phone": {
      "phone": "+44123456789",
      "type": "work"
    },
    "responsible": {
      "id": 234,
      "name": "John Beam",
      "ext_num": "100"
    }
}
```

**where**

* **contact\_type** — contact type:
  + lead — lead
* **id** — lead identification
* **name** — lead name
* **phone** — phone number. Contains the following fields:
  + **phone** — the number itself
  + **type** — number type. Possible values:
    - work — work
    - personal — personal
* **responsible** — responsible user. Contains the following fields:
  + **id** — user identification
  + **name** — user name
  + **ext\_num** — user PBX extension

**User**

(Response 5) 

```
                                    Response 5:  
{
    "contact_type": "user",
    "id": 234,
    "name": "John Beam",
    "avatar": 2457,
    "role": "",
    "status": "",
    "phone": {
      "phone": "100",
      "type": "internal"
    },
    "group": {
      "type": "admin",
      "title": ""
    }
}
```

**where**

* **contact\_type** — contact type:
  + user — user
* **id** — user identification
* **name** — user name
* **avatar** — user avatar (file identification)
* **role** — user role
* **status** — user status
* **phone** — phone number. Contains the following fields:
  + **phone** — the number itself
  + **type** — number type. Possible values:
    - work — work
    - personal — personal
    - internal — PBX extension
* **group** — user group. Contains the following fields:
  + **type** — group type. Possible values:
    - admin — admins
    - manager — managers
    - chat\_operator — operators
    - trainee — trainees
    - custom — custom
  + **title** — custom group title (for type = custom)

## get /v1/zcrm/contacts/identify

Identifies contact (client, employee, lead, user) by the phone number

**Parameters**

* **phone** — phone number

**Response**

The response will depend on the found contact (client, employee, lead, user).

**Client**

(Response 1) 

```
                                    Response 1:  
{
  "contact_type": "customer",
  "id": 3486,
  "name": "Good Company",
  "status": "company",
  "type": "client",
  "phone": {
    "phone": "+44123456789",
    "type": "work"
  },
  "responsible": {
    "id": 234,
    "name": "John Beam",
    "ext_num": "100"
  }
}
```

**where**

* **contact\_type** — contact type:
  + customer — client
* **id** — client identification
* **name** — client name
* **status** — client status. Possible values:
  + individual — personal user
  + company — company/business
* **type** — client type. Possible values:
  + potential — potential client
  + client — client
  + reseller — reseller
  + partner — partner
* **phone** — phone number. Contains the following fields:
  + **phone** — the number itself
  + **type** — number type. Possible values:
    - work — work
    - personal — personal
* **responsible** — responsible user. Contains the following fields:
  + **id** — user identification
  + **name** — user name
  + **ext\_num** — user PBX extension

**Client's employee**

(Response 2) 

```
                                    Response 2:  
{
  "contact_type": "employee",
  "id": 8,
  "name": "Michael Simpson",
  "phone": {
    "phone": "+44123456789",
    "type": "work"
  },
  "position": {
    "position": "manager",
    "title": ""
  },
  "customer": {
    "id": 3486,
    "name": "Good Company"
  },
  "responsible": {
    "id": 234,
    "name": "John Beam",
    "ext_num": "100"
  }
}
```

**where**

* **contact\_type** — contact type:
  + employee — employee
* **id** — employee identification
* **name** — employee name
* **phone** — phone number. Contains the following fields:
  + **phone** — the number itself
  + **type** — number type. Possible values:
    - work — work
    - personal — personal
* **position** — employee position. Contains the following fields:
  + **position** — position. Possible values:
    - ceo — CEO
    - director — director
    - manager — manager
    - sales\_manager — sales manager
    - hr — HR
    - support — support
    - custom — custom
  + **title** — custom position title (for position = custom)
* **customer** — client, to whom the employee is attached. Contains the following fields:
  + **id** — client identification
  + **name** — client name
* **responsible** — user responsible for the parent entity. Contains the following fields:
  + **id** — user identification
  + **name** — user name
  + **ext\_num** — user PBX extension

**Lead**

(Response 3) 

```
                                    Response 3:  
{
  "contact_type": "lead",
  "id": 3486,
  "name": "Good Company",
  "phone": {
    "phone": "+44123456789",
    "type": "work"
  },
  "responsible": {
    "id": 234,
    "name": "John Beam",
    "ext_num": "100"
  }
}
```

**where**

* **contact\_type** — contact type:
  + lead — lead
* **id** — lead identification
* **name** — lead name
* **phone** — phone number. Contains the following fields:
  + **phone** — the number itself
  + **type** — number type. Possible values:
    - work — work
    - personal — personal
* **responsible** — responsible user. Contains the following fields:
  + **id** — user identification
  + **name** — user name
  + **ext\_num** — user PBX extension

**User**

(Response 4) 

```
                                    Response 4:  
{
  "contact_type": "user",
  "id": 234,
  "name": "John Beam",
  "avatar": 2457,
  "role": "",
  "status": "",
  "phone": {
    "phone": "100",
    "type": "internal"
  },
  "group": {
    "type": "admin",
    "title": ""
  }
}
```

**where**

* **contact\_type** — contact type:
  + user — user
* **id** — user identification
* **name** — user name
* **avatar** — user avatar (file identification)
* **role** — user role
* **status** — user status
* **phone** — phone number. Contains the following fields:
  + **phone** — the number itself
  + **type** — number type. Possible values:
    - work — work
    - personal — personal
    - internal — PBX extension
* **group** — user group. Contains the following fields:
  + **type** — group type. Possible values:
    - admin — admins
    - manager — managers
    - chat\_operator — operators
    - trainee — trainees
    - custom — custom
  + **title** — custom group title (for type = custom)

## Deals

## get /v1/zcrm/deals

Returns the deals list

#### Parameters

* **search** (optional) — search bar. Searching deals by name.
* **filter** (optional) — an object with deal filters. Object structure:
  (Response 1) 

  ```
                                      Response 1:  
  {
    "filter": {
    "currency": "USD",
    "responsible_user": 20,
    "status": "new"
  }
  }
  ```

  where:

  + **currency** — deal currency. Three-letter code ISO 4217: USD, EUR, etc.
  + **responsible\_user** — responsible user (user identification)
  + **status** — deal status. Possible values:
  + new — new deal
  + in\_progress — deal in progress
  + decision — in the decision stage
  + payment — awaiting payment
  + success — successful deal
  + canceled — deal canceled

  Any parameter can be skipped as they are all optional.
* **sort** (optional) — deal sorting. Object structure:
  (Response 2) 

  ```
                                      Response 2:  
  {
    "sort": {  "attr": "name",
    "desc": 0
  }
  }
  ```

  Where:

  + **attr** — sorting/filtering field. Possible values:
  + title — deal title
  + budget — deal budget
  + status — deal status
  + created\_at — date of deal creation
  + **desc** — sorting direction. Possible values:
  + 0 — increasing order
  + 1 — decreasing order
* **take** (for per page display) — how many deals to return (20 by default)
* **skip** (for per page display) — how many deals to skip (0 by default)

#### Response

(Response 3) 

```
                                    Response 3:  
{
  "totalCount": 82,
  "deals": [
    {
      "id": 83,
      "title": "Good deal",
      "budget": 990.00,
      "currency": "USD",
      "status": "new",
      "responsible_user": 20,
      "created_at": "2021-10-05 12:40:10",
      "created_by": 20,
      "customer_id": 65,
      "customer_is_lead": 0,
      "customer_name": "Good company",
      "customer_responsible_user": 20
    }
  ]
}
```

Where:

* **totalCount** — total number of deals (including the search bar and filter)
* **deals** — array of deals (including per page display). Each element of the array includes the following parameters:
  + **id** — deal id
  + **title** — deal title
  + **budget** — deal budget
  + **currency** — deal currency. Three-letter code ISO 4217: USD, EUR, etc.
  + **status** — deal status. Possible values:
    - new — new deal
    - in\_progress — deal in progress
    - decision — in the decision stage
    - payment — awaiting payment
    - success — successful deal
    - canceled — deal canceled
  + **responsible\_user** — responsible user (user identification)
  + **created\_at** — deal creation date and time (in `YYYY-MM-DD HH:mm:ss` format)
  + **created\_by** — who created the deal (user identification)
  + **customer\_id** — identification of the client associated with the deal
  + **customer\_is\_lead** — flag, showing whether the client is a lead
  + **customer\_name** — name of the client associated with the deal
  + **customer\_responsible\_user** — agent responsible for the client (user identification)

## get /v1/zcrm/deals/<deal\_id>

Returns a deal by its ID

#### Address parameters

* **deal\_id** — deal id

#### Response

```
                                    {
  "id": 83,
  "title": "Good deal",
  "budget": 990.00,
  "currency": "USD",
  "status": "new",
  "responsible_user": 20,
  "created_at": "2021-10-05 12:40:10",
  "created_by": 20,
  "customer_id": 65,
  "customer_is_lead": 0,
  "customer_name": "Good company",
  "customer_responsible_user": 20
}
```

Where:

* **id** — deal id
* **title** — deal title
* **budget** — deal budget
* **currency** — deal currency. Three-letter code ISO 4217: USD, EUR, etc.
* **status** — deal status. Possible values:
  + new — new deal
  + in\_progress — deal in progress
  + decision — in the decision stage
  + payment — awaiting payment
  + success — successful deal
  + canceled — deal canceled
* **responsible\_user** — responsible user (user identification)
* **created\_at** — deal creation date and time (in `YYYY-MM-DD HH:mm:ss` format)
* **created\_by** — who created the deal (user identification)
* **customer\_id** — identification of the client associated with the deal
* **customer\_is\_lead** — flag, showing whether the client is a lead
* **customer\_name** — name of the client associated with the deal
* **customer\_responsible\_user** — agent responsible for the client (user identification)

## post /v1/zcrm/deals

Created a new deal with the data entered

#### Parameters

* **deal** — an object containing the data of a new deal. Object structure:
  (Response 1) 

  ```
                                      Response 1:  
  {
    "deal": {
    "title": "Good deal",
    "budget": 990.00,
    "currency": "USD",
    "status": "new",
    "responsible_user": 20,
    "customer_id": 65
  }
  }
  ```

    
  Where:

  + **title** — deal title
  + **budget** — deal budget
  + **currency** — deal currency. Three-letter code ISO 4217: USD, EUR, etc.
  + **status** — deal status. Possible values:
  + new — new deal
  + in\_progress — deal in progress
  + decision — in the decision stage
  + payment — awaiting payment
  + success — successful deal
  + canceled — deal canceled
  + **responsible\_user** — responsible user (user identification)
  + **customer\_id** — identification of the client associated with the deal

#### Response

(Response 2) 

```
                                    Response 2:  
{
  "id": 83
}
```

Where:

* **id** — id of the newly created deal

## put /v1/zcrm/deals/<deal\_id>

Updates an existing deal with the specified ID

#### Address parameters

* **deal\_id** — deal id

#### Parameters

* **deal** — new deal information. Deal structure:

```
                                    {
  "deal": { 
  "title": "Good deal",
  "budget": 990.00,
  "currency": "USD",
  "status": "new",
  "responsible_user": 20
}
}
```

Where:

* **title** — deal title
* **budget** — deal budget
* **currency** — deal currency. Three-letter code ISO 4217: USD, EUR, etc
* **status** — deal status. Possible values:
  + new — new deal
  + in\_progress — deal in progress
  + decision — in the decision stage
  + payment — awaiting payment
  + success — successful deal
  + canceled — deal canceled
* **responsible\_user** — responsible user (user identification)

## delete /v1/zcrm/deals/<deal\_id>

Deletes a deal by its ID

#### Address parameters

* **deal\_id** — deal id

## Deal feed

## get /v1/zcrm/deals/<deal\_id>/feed

Returns records in the deal feed

#### Address parameters

* **deal\_id** — deal id

#### Response

```
                                    {
  "totalCount": 17,
  "items": [
    {
      "id": 37825,
      "type": "note",
      "content": "Call to the client",
      "time": "2020-06-08 06:55:02",
      "user_id": 20,
      "user_name": "John Beam",
      "attached_files": [
        {
          "file_id": 576,
          "original_filename": "document.doc"
        }
      ]
    }
  ]
}
```

**Where:**

* **totalCount** — total number of records
* **items** — array of records. Each record contains the following attributes:
  + **id** — record id
  + **type** — record type. Possible values:
    - event
    - note
  + **content** — record content. If record type is note, this attribute contains note text. If record type is event, this attribute contains event identification, for example:
    - DEAL\_CREATED — deal creation event
    - DEAL\_STATUS\_CHANGED: success — deal status change event: successful deal
  + **time** — record time in `YYYY-MM-DD hh:mm:ss` format
  + **user\_id** — identification of the user, who created the record
  + **user\_name** — name of the user, who created the record
  + **attached\_files** — array of files attached to a note (if record type is a note). Each array element contains the following attributes:
    - **file\_id** — file id
    - **original\_filename** — original file name

## post /v1/zcrm/deals/<deal\_id>/feed

Adds a text note to the deal feed with ability to attach files

#### Address parameters

* **deal\_id** — deal id

#### Parameters

* **content** — text content of the note
* **files** —array of attached files

#### Response

```
                                    {
  "id": 37825,
  "type": "note",
  "content": "Call to the client",
  "time": "2020-06-08 06:55:02",
  "user_id": 20,
  "user_name": "John Beam",
  "attached_files": [
    {
      "file_id": 576,
      "original_filename": "document.doc"
    }
  ]
}
```

**Where:**

* **id** — record id
* **type** — record type. In this case equals:
  + note — text note
* **content** — text content of the note
* **time** — record time in `YYYY-MM-DD hh:mm:ss` format
* **user\_id** — identification of the user, who created the record
* **user\_name** — name of the user, who created the record
* **attached\_files** — array of files attached to a note (if record type is a note). Each array element contains the following attributes:
  + **file\_id** — file id
  + **original\_filename** — original file name

## put /v1/zcrm/deals/<deal\_id>/feed/<i\_id>

Updates content of the existing text note by its ID

#### Address parameters

* **deal\_id** — deal id
* **i\_id** — note id

#### Parameters

* **content** — new note content

## delete /v1/zcrm/deals/<deal\_id>/feed/<i\_id>

Deletes a note in the deal feed by its ID

#### Address parameters

* **deal\_id** — deal id
* **i\_id** — note id

## Tasks

## get /v1/zcrm/events

Returns task list

**Parameters**

* **search** (optional) - search bar. Search is carried out in combination by:
  + task name
  + task description
  + comments to completed tasks
* **filter** (optional) - task filter. Filter structure:

(Response 1) 

```
                                    Response 1:  
{
  "filter": {
    "responsible": 456,
    "createdBy": 456,
    "start": "2020-06-03 02:56:00",
    "end": "2020-06-12 02:56:00",
    "completed": 1
}
}
```

**where:**

* **responsible** —responsible (user identification)
* **createdBy** — created by (user identification)
* **start** — display tasks starting **after** the specified time (in format `YYYY-MM-DD hh:mm:ss`)
* **end** — display tasks ending **before** the specified time (in format `YYYY-MM-DD hh:mm:ss`)
* **completed** — set in 1 to also display completed tasks

* **sort** (optional) - task sorting. Parameter structure:

(Response 2) 

```
                                    Response 2:  
{
  "sort": {
    "attr": "start",
    "desc": 0
}
}
```

**where:**

* **attr** — sorting field. Valid value:
  + responsible — responsible user
  + title — task title
  + start — task beginning time
  + end — task ending time
* **desc** — sorting order. Valid value:
  + 0 — ascending
  + 1 — descending

**Response**

(Response 3) 

```
                                    Response 3:  
{
  "totalCount": 4,
  "events": [
    {
      "id": 40,
      "type": "task",
      "title": "Create text for Good Company",
      "description": "",
      "start": "2020-05-26 09:00:00",
      "end": "2020-05-26 12:30:00",
      "allDay": false,
      "created_by": 234,
      "responsible_user": 234,
      "phone": "",
      "call_done": 0,
      "completed": 0,
      "completed_comment": "",
      "members": [234, 235],
      "customers": [
        {
          "id": 3486,
          "name": "Good Company",
          "status": "company",
          "type": "client",
          "lead_source": "manual",
          "lead_status": "not_processed",
          "contact_type": "customer"
        }
      ]
    }
  ]
}
```

**where**

* **totalCount** — total number of tasks
* **events** — tasks array. Each task contains the following attributes:
  + **id** — task identification
  + **type** — task type. Possible values:
    - task — task
    - call — call
  + **title** — task title
  + **description** — task description (in format: Quill Delta)
  + **start** — task beginning date and time (in format `YYYY-MM-DD hh:mm:ss`)
  + **end** — task ending date and time (in format `YYYY-MM-DD hh:mm:ss`)
  + **allDay** — all-day task (`true` or `false`) — date is determined by parameter **start**
  + **created\_by** — identification of the user who created the task
  + **responsible\_user** — identification of the responsible user
  + **phone** — phone number for a call (if task type is call)
  + **call\_done** — indicates if the call was made
  + **completed** — indicated of the task was marked as complete
  + **completed\_comment** — comment to a completed task
  + **members** — task members array (only users’ identifications)
  + **customers** — array of clients and leads attached to the task. Each array element contains the following fields:
    - **id** — client/lead identification
    - **name** — client/lead name
    - **status** — client status. Possible values:
      * individual — personal user
      * company — company/business
    - **type** — client type. Possible values:
      * potential — potential client
      * client — client
      * reseller — reseller
      * partner — partner
    - **lead\_source** — lead source. Possible values:
      * manual — manual
      * call\_incoming — incoming call
      * call\_outgoing — outgoing call
      * form — form
    - **lead\_status** — lead status. Possible values:
      * not\_processed — not processed
      * in\_progress — in progress
      * finished — finished
    - **contact\_type** — contact type. Possible values:
      * customer — client
      * lead — lead

## get /v1/zcrm/events/<event\_id>

Returns a task by its ID

**Response**

```
                                    {
  "id": 40,
  "type": "task",
  "title": "Create text for Good Company",
  "description": "",
  "start": "2020-05-26 09:00:00",
  "end": "2020-05-26 12:30:00",
  "allDay": false,
  "created_by": 234,
  "responsible_user": 234,
  "phone": "",
  "call_done": 0,
  "completed": 0,
  "completed_comment": "",
  "members": [234, 235],
  "customers": [
    {
      "id": 3486,
      "name": "Good Company",
      "status": "company",
      "type": "client",
      "lead_source": "manual",
      "lead_status": "not_processed",
      "contact_type": "customer"
    }
  ]
}
```

**where**

* **id** — task identification
* **type** — task type. Possible values:
  + task — task
  + call — call
* **title** — task title
* **description** — task description (in format Quill Delta)
* **start** — task starting date and time (in format `YYYY-MM-DD hh:mm:ss`)
* **end** — task ending date and time (in format `YYYY-MM-DD hh:mm:ss`)
* **allDay** — all-day task (`true` or `false`)
* **created\_by** — identification of the user who created the task
* **responsible\_user** — identification of the responsible user
* **phone** — phone number for the call (if task type is call)
* **call\_done** — indicates if the call was made
* **completed** — indicated the task was completed
* **completed\_comment** — comments to a completed task
* **members** — task members array (only user identifications)
* **customers** — array of clients and leads attached to the task. Each array element contains the following fields:
  + **id** — client/lead identification
  + **name** — client/lead name
  + **status** — client status. Possible values:
    - individual — personal user
    - company — company/business
  + **type** — client type. Possible values:
    - potential — potential client
    - client — client
    - reseller — reseller
    - partner — partner
  + **lead\_source** — lead source. Possible value:
    - manual — manual
    - call\_incoming — incoming call
    - call\_outgoing — outgoing call
    - form — form
  + **lead\_status** — lead status. Possible values:
    - not\_processed — not processed
    - in\_progress — in progress
    - finished — finished
  + **contact\_type** — contact type. Possible values:
    - customer — client
    - lead — lead

## post /v1/zcrm/events

Created a new task with indicated information

**Parameters**

* **event** — an object containing the data of a new task. Object structure:
  (Response 1) 

  ```
                                      Response 1:  
  {
    "event": { 
      "type": "task",
      "title": "Create text for Good Company",
      "description": "",
      "start": "2020-05-26 09:00:00",
      "end": "2020-05-26 12:30:00",
      "allDay": false,
      "responsible_user": 234,
      "phone": "",
      "members": [234, 235],
      "customers": [3486, 3487]
  }
  }
  ```

  **where**
* **type** — task type. Valid values:

  + task — task
  + call — call
* **title** — task title
* **description** — task description (in format Quill Delta)
* **start** — task beginning date and time (in format `YYYY-MM-DD hh:mm:ss`)
* **end** — task ending date and time (in format `YYYY-MM-DD hh:mm:ss`)
* **allDay** — all-day task (`true` or `false`)
* **responsible\_user** — responsible user identification
* **phone** — phone number for the call (if task type is call)
* **members** —task members array (only user identifications)
* **customers** — attached clients and leads array (only client and lead identification)

**Response**
(Response 2) 

```
                                    Response 2:  
{
  "id": 7216
}
```

**where**

* **id** — new task identification

## put /v1/zcrm/events/<event\_id>

Updates an existing task with indicated ID

**Parameters**

* **event** — an object with the updated task data. Object structure:

```
                                    {
  "event": { 
    "title": "Create text for Good Company",
    "description": "",
    "start": "2020-05-26 09:00:00",
    "end": "2020-05-26 12:30:00",
    "allDay": false,
    "created_by": 234,
    "responsible_user": 234,
    "phone": "",
    "members": [234, 235],
    "customers": [3486, 3487]
}
}
```

**where**

* **title** — task title
* **description** — task description (in format Quill Delta)
* **start** — task beginning date and time (in format `YYYY-MM-DD hh:mm:ss`)
* **end** — task ending date and time (in format `YYYY-MM-DD hh:mm:ss`)
* **allDay** — all-day task (`true` or `false`)
* **responsible\_user** — responsible user identification
* **phone** — phone number for the call (if task type is call)
* **members** — task members array (only user identification)
* **customers** — attached client and lead array (only client and lead identification)

## post /v1/zcrm/events/<event\_id>/close

Completes (closes) the task

**Parameters**

* **comment** (optional) - comment

## delete /v1/zcrm/events/<event\_id>

Deleted a task by its ID

## Calls

## get /v1/zcrm/calls

Returns call list

**Parameters**

* **search** (optional) - search bar. Search is carried out in combination by:
  + phone numbers
  + contact names (clients, employees, leads or users)
* **take** (pagination) - how many calls to return (20 by default)
* **skip** (pagination) - how many calls to skip (0 by default)
* **sort** (optional) - call sorting. Object structure:
* **filter** (optional) - an object with call filters. Object structure:
  (Response 1) 

  ```
                                      Response 1:  
  {
    "filter": {
      "user": 23,
      "type": "incoming",
      "status": "answer",
      "dateFrom": "2020-06-03 14:56:00",
      "dateTo": "2020-06-26 14:56:00"
  }
  }
  ```

  **where**

  + **user** — user (identification)
  + **type** — call type. Valid values:
  + incoming — incoming call
  + outgoing — outgoing call
  + **status** — call status. Valid values:
  + answer — successful call
  + noanswer — no answer
  + cancel — canceled calls
  + busy — busy
  + failed — failed call
  + **dateFrom** — display only calls made **after** specified time (format: `YYYY-MM-DD hh:mm:ss`)
  + **dateTo** — display only calls made **before** specified time (format: `YYYY-MM-DD hh:mm:ss`)

Any of the filter parameters can be skipped, meaning it is not required.

(Response 2) 

```
                                    Response 2:  
{
  "sort": {
    "attr": "time",
    "desc": 0
}
}
```

**where**

* **attr** — sorting field. Valid values:
  + phone — phone number
  + status — call status
  + duration — call duration
  + time — call time
* **desc** — sorting direction. Valid values:
  + 0 — ascending
  + 1 — decending

**Response**
(Response 3) 

```
                                    Response 3:  
{
  "totalCount": 233,
  "calls": [
    {
      "id": 127,
      "type": "outgoing",
      "status": "answer",
      "phone": "+44123456789",
      "user_id": 179,
      "time": "2019-07-31 17:58:40",
      "duration": 9,
      "pbx_call_id": "out_807ghh1h7f09fa7a188dbf8a6998b1c9ghg4ij06",
      "record": 1,
      "record_url_till": "2020-07-24 20:08:10",
      "contact_type": "customer",
      "contact_name": "Good Company",
      "contact_customer_id": 3486,
      "contact_employee_id": null,
      "employee_customer_id": null,
      "contact_user_id": null,
      "is_lead": 1,
      "record_urls": [
        {
          "url": "https ://api.zadarma.com/v1/pbx/record/download/[...]/[...]/[...].mp3"
        }
      ]
    }
  ]
}
```

**where**

* **totalCount** — total number of calls (including search bar and filter)
* **calls** — call array (including pagination). Each array element contains the following parameters:  
  + **id** — call identification
  + **type** — call type. Possible values:
    - incoming — incoming call
    - outgoing — outgoing call
  + **status** — call status. Possible values:
    - answer — successful call
    - noanswer — no answer
    - cancel — canceled
    - busy — busy
    - failed — failed call
  + **phone** — phone number
  + **user\_id** — user, who initiated or accepted the call
  + **time** — call time in format `YYYY-MM-DD hh:mm:ss`
  + **duration** — call duration in seconds
  + **pbx\_call\_id** — call identification in Zadarma PBX
  + **record** — if call recording enabled
  + **record\_url\_till** — time, until when call recording link will be active
  + **contact\_type** — contact type. Possible values:
    - customer — client or lead (see parameter **is\_lead**)
    - employee — client employee
    - user — user
  + **contact\_name** — contact name
  + **contact\_customer\_id** — client or lead identification (if the call is related to a client)
  + **contact\_employee\_id** — employee identification (if the call is related to an employee)
  + **employee\_customer\_id** — parent entity identification (if the call is related to an employee)
  + **contact\_user\_id** — user identification (if the call is related to a user)
  + **is\_lead** — shows if the call is related to a lead
  + **record\_urls** — call recordings array (can be missing, as has to be specifically requested). Each array element is an object that contains the following field:
    - **url** — link to the call recording

## Files

## get /v1/zcrm/files/<file\_id>

Gives files by its ID

# Call notification system - webhook

Zadarma system can send information about each call to virtual PBX and route calls to the necessary extension depending on the response. In order to do this, create an open link, which will accept POST-requests with information from the Zadarma system.

**Step 1. Add the code at the beginning of the script**

```
<?php if (isset($_GET['zd_echo'])) exit($_GET['zd_echo']); ?>
```

**Step 2. Add the URL for webhook**

Go to ["Settings" → "Integrations and API"](https://my.zadarma.com/marketplace/), in the Notifications block, enter your URL in the field for PBX call notifications, then click "Enable"

## Calls

## NOTIFY\_START

start of an incoming call in the PBX

**Parameters that are sent to the notification link:**

* **event** – event (NOTIFY\_START)
* **call\_start** – call start time;
* **pbx\_call\_id** – call id;
* **caller\_id** – caller number;
* **called\_did** – called number.

Creating a verification signature for notification of incoming calls, PHP example:

```
                                    $signatureTest = base64_encode(hash_hmac('sha1', 
        $_POST['caller_id'] . $_POST['called_did'] . 
        $_POST['call_start'], API_SECRET));
```

For NOTIFY\_START и NOTIFY\_IVR requests, you can **change the scenario** for the current call «on the fly». To do this **send in response to the webhook** of the following options:

**1. Transfer the call:**

(Response 1) 

```
                                    Response 1:  
{
    "redirect": ID,
    "return_timeout": TIMEOUT (необязательное)
}
```

**Where:**

* **redirect** - redirection scenario id (in the format 0-1, where 0 is the voice menu number, 1 is the scenario number); or in format 1, where 1 is the scenario number (the voice menu number in this case is 0); or the PBX menu in the 0-main format, where 0 is the menu id; or PBX extension (three-digit number); or “blacklist” - in this case the call will be rejected with a busy signal;
* **return\_timeout** - Value in seconds. Possible values:
  + 0, the call will not return to the menu;
  + >= 3 - call duration to an extension before the call is returned to the menu;
* **rewrite\_forward\_number**  - call forwarding to phone number. An optional parameter, available for use only with the redirect parameter. Required to replace “on the fly” the phone number for call forwarding, which is specified in the PBX extension settings.

**2. End the call:**

(Response 2) 

```
                                    Response 2:  
{
    "hangup": 1
}
```

**3. Set incoming number name**

You can set the name of the calling number (SIP CallerName field) and it will be reflected in the application. This way it is convenient to transmit the name of the caller if his/her number is in your system.

(Response 3) 

```
                                    Response 3:  
{
    "caller_name": NAME
}
```

**Where:**

* **caller\_name** - number name.

**Each of the following options (digits 4-7) can contain the caller's response in the form of numbers. Number input parameters:**

(Response 4) 

```
                                    Response 4:  
{
    "wait_dtmf": {
        "timeout": TIMEOUT,
        "attempts": ATTEMPTS,
        "maxdigits": MAXDIGITS,
        "name": NAME,
        "default": DEFAULT,
    }
}
```

**Where:**

* **timeout** - waiting time for entering digits in seconds;
* **attempts** - number of attempts to dial a digit from a caller;
* **maxdigits** - maximum number of digits to wait for input;
* **name** - the name that will be returned in the response;
* **default** - action if no digits have been dialled (please note that for the action to work, you must first play the file using the ivr\_play command as per step 4 below). Possible values:
  + redirect scenario id (in format 0-1, where 0 is the voice menu number, 1 is the scenario number);
  + PBX menu in 0-main format, where 0 is the menu id;
  + PBX extension (three-digit number);
  + hangup - end the call.

**4. Play the file**

(Response 5) 

```
                                    Response 5:  
{
    "ivr_play": "ID"
}
```

**Where:**

* **ivr\_play** – value from the ID column in the list of downloaded/read files for the desired file.

**5. Play popular phrase:**

(Response 6) 

```
                                    Response 6:  
{
    "ivr_saypopular": 1,
    "language": "en"
}
```

**Where:**

* **ivr\_saypopular** – phrase number from the list;

**Lists of popular phrases:**

* Hello
* Good afternoon
* Call forwarding
* Call from the website
* Welcome
* Test message
* Please stay on the line
* You called outside of business hours
* All managers are currently busy, your call will be answered by the first available operator.
* Enter caller’s extension
* Enter employee’s extension
* Enter the extension
* Please hold
* Enter the extension number or wait for the operator to answer
* Please leave a message
* Please leave a message after the tone
* Please call back during business hours
* Thank you for contacting our company.
* Thank you for calling.
* Please wait for the operator to answer
* Your call is very important to us
* The call is being recorded
* We are not in the office at the moment
* We will return your call as soon as possible
* We are out of the office today

**6. Play digits:**

(Response 7) 

```
                                    Response 7:  
{
    "ivr_saydigits": "12",
    "language": "en"
}
```

**7. Reproduce the number:**

(Response 8) 

```
                                    Response 8:  
{
    "ivr_saynumber": "123",
    "language": "en"
}
```

\*Where:\*\*

* **language** can accept one of the values: ru, en, es, pl;

**If ivr\_saydigits or ivr\_saynumber were specified, in the next NOTIFY\_IVR evet the following parameter will be added:**
**"ivr\_saydigits"**: "COMPLETE" or **"ivr\_saynumber"**: "COMPLETE"

**In the next NOTIFY\_IVR event the parameter will be additionally specified:**

(Response 9) 

```
                                    Response 9:  
{
    "wait_dtmf": {
        "name": NAME,
        "digits": DIGITS,
        "default_behaviour": "1"
    }
}
```

**Where:**

* **name** - the name provided in the previous answer;
* **digits** - digits entered by the caller;
* **default\_behaviour** - indicated if the caller did not press anything and the default behaviour was triggered;

## NOTIFY\_INTERNAL

the start of an incoming call to the PBX extension

#### Parameters glossary:

* **event** – the event (NOTIFY\_INTERNAL)
* **call\_start** – the call start time;
* **pbx\_call\_id** – the call ID;
* **caller\_id** – the caller's phone number;
* **called\_did** – the phone number that was called;
* **internal** – (optional) extension;
* **transfer\_from** – (optional) transfer initiator, extension.
* **transfer\_type** – (optional) transfer type.

#### Creation of verification signature for notification about incoming calls, example on PHP:

```
                                    $signatureTest = base64_encode(hash_hmac('sha1', 
        $_POST['caller_id'] . $_POST['called_did'] . 
        $_POST['call_start'], API_SECRET));
```

## NOTIFY\_ANSWER

the internal or external call response

#### Parameters glossary:

* **event** – the event (NOTIFY\_ANSWER)
* **caller\_id** – the caller's phone number;
* **destination** – the phone number that was called;
* **call\_start** – the call start time;
* **pbx\_call\_id** – the call ID;
* **internal** – (optional) extension.
* **transfer\_from** – (optional) the initiator of the transfer, extension.
* **transfer\_type** – (optional) transfer type.

#### Creation of verification signature for notification about incoming calls, example on PHP:

```
                                    $signatureTest = base64_encode(hash_hmac('sha1', 
        $_POST['caller_id'] . $_POST['destination'] . 
        $_POST['call_start'], API_SECRET));
```

## NOTIFY\_END

the end of an incoming call to the PBX extension

#### Parameters glossary:

* **event** – the event (NOTIFY\_END)
* **call\_start** – the call start time;
* **pbx\_call\_id** – the call ID;
* **caller\_id** – the caller's phone number;
* **called\_did** – the phone number that was called;
* **internal** – (optional) extension;
* **duration** – length in seconds;
* **disposition** – call status:
  + **'answered'** – conversation,
  + **'busy'** – busy,
  + **'cancel'** - cancelled,
  + **'no answer'** - no answer,
  + **'failed'** - failed,
  + **'no money'** - no funds, the limit has been exceeded,
  + **'unallocated number'** - the phone number does not exist,
  + **'no limit'** - the limit has been exceeded,
  + **'no day limit'** - the day limit has been exceeded,
  + **'line limit'** - the line limit has been exceeded,
  + **'no money, no limit'** - the limit has been exceeded;
* **last\_internal** – extension, the last call participant (after transfer or pickup);
* **status\_code** – call status code Q.931;
* **is\_recorded** – 1 - there is a call recording, 0 - there is no call recording;
* **call\_id\_with\_rec** – the ID of the call with call recording (we recommend you to download the recorded file in 40 seconds after the notification, as certain time period is needed for the file with the recording to be saved).

#### Creation of verification signature for notification about incoming calls, example on PHP:

```
                                    $signatureTest = base64_encode(hash_hmac('sha1', 
        $_POST['caller_id'] . $_POST['called_did'] . 
        $_POST['call_start'], API_SECRET));
```

## NOTIFY\_OUT\_START

the start of an outgoing call from the PBX

#### Parameters glossary:

* **event** – the event (NOTIFY\_OUT\_START)
* **call\_start** – the call start;
* **pbx\_call\_id** – the call ID;
* **destination** – the phone number that was called;
* **internal** – (optional) extension.

#### Creation of verification signature for notification about incoming calls, example on PHP:

```
                                    $signatureTest = base64_encode(hash_hmac('sha1', 
        $_POST['internal'] . $_POST['destination'] . 
        $_POST['call_start'], API_SECRET));
```

## NOTIFY\_OUT\_END

the end of an outgoing call from the PBX

#### Parameters glossary:

* **event** – the event (NOTIFY\_OUT\_END)
* **call\_start** – the call start time;
* **pbx\_call\_id** – the call ID;
* **caller\_id** – the caller's phone number;
* **destination** – the phone number that was called;
* **internal** – (optional) extension;
* **duration** – length in seconds;
* **disposition** – call status:
  + **'answered'** – conversation,
  + **'busy'** – busy,
  + **'cancel'** - cancelled,
  + **'no answer'** - no answer,
  + **'failed'** - failed,
  + **'no money'** - no funds, the limit has been exceeded,
  + **'unallocated number'** - the phone number does not exist,
  + **'no limit'** - the limit has been exceeded,
  + **'no day limit'** - the day limit has been exceeded,
  + **'line limit'** - the line limit has been exceeded,
  + **'no money, no limit'** - the limit has been exceeded;
* **status\_code** – call status code Q.931;
* **is\_recorded** – 1 - there is a call recording, 0 - there is no call recording;
* **call\_id\_with\_rec** – the ID of the call with call recording (we recommend you to download the recorded file in 40 seconds after the notification, as certain time period is needed for the file with the recording to be saved).

#### Creation of verification signature for notification about incoming calls, example on PHP:

```
                                    $signatureTest = base64_encode(hash_hmac('sha1', 
        $_POST['internal'] . $_POST['destination'] . 
        $_POST['call_start'], API_SECRET));
```

## NOTIFY\_RECORD

the call recording is ready for download

#### Parameters glossary:

* **event** – the event (NOTIFY\_RECORD)
* **call\_id\_with\_rec** – unique ID of the call with the call recording;
* **pbx\_call\_id** – permanent ID of the external call to the PBX (does not alter with the scenario changes, voice menu, etc., it is displayed in the statistics and notifications).

#### Creation of verification signature for notification about incoming calls, example on PHP:

```
                                    $signatureTest = base64_encode(hash_hmac('sha1', 
        $_POST['pbx_call_id'] . $_POST['call_id_with_rec'], API_SECRET));
```

## NOTIFY\_IVR

caller’s response to the assigned action

#### Parameters that are sent to the link for notifications:

* **event** – event (NOTIFY\_IVR)
* **call\_start** – call start time;
* **pbx\_call\_id** – call id;
* **caller\_id** – caller number;
* **called\_did** – called number.

#### Creating a verification signature for incoming calls notifications, PHP example:

```
                                    $signatureTest = base64_encode(hash_hmac('sha1', 
        $_POST['caller_id'] . $_POST['called_did'] . 
        $_POST['call_start'], API_SECRET));
```

#### Possible responses sent to similar responses as to NOTIFY\_START requests

## Other

## NUMBER\_LOOKUP

number lookup report

#### Parameters that send out a notification link:

* **event** – event (NUMBER\_LOOKUP);
* **success** – successful check flag;
* **description** – textual description of check completion status;
* **result** – report results;
  + **number** – checked number;
  + **mcc** – mobile country code;
  + **mnc** – mobile network code;
  + **ported** – sign of number porting to other provider;
  + **roaming** – sign of being in roaming;
  + **error** – error status;
  + **errorDescription** – textual error description;
  + **mccName** – country name;
  + **mncName** – provider name;

#### Test signature creation:

$signatureTest = base64\_encode(hash\_hmac('sha1', $\_POST['result'], API\_SECRET));

## CALL\_TRACKING

information about calls to the numbers connected to call tracking

#### It is sent out every 8 minutes, provided there are new calls.

**Parameters that are sent to the link for notifications:**

* **event** – event (CALL\_TRACKING);
* **result** - array
  + **tracker** - ID tracker (can be found on the code installation page);
  + **start** - call starting time;
  + **duration** - call duration in seconds;
  + **caller\_id** - caller’s number;
  + **caller\_did** - the number that was called;
  + **country** - (optional) the country the call was made from;
  + **ga\_id** - (optional, if Google Analytics ID is specified in the settings) Google Analytics ID of the visitor;
  + **url** - address of the page from which the call originated;
  + **utm\_source, utm\_medium, utm\_campaign, utm\_term, utm\_content** - (optional, if utm tags were specified when visiting the website) utm tags specified during the last website visit by the user;
  + **first\_utm** - (optional, if utm tags during the first visit differ from the ones specified during the last visit) array of utm tags mentioned above used by the visitor to access the website for the first time;
  + **pbx\_call\_id** - the call ID (except Toll Free);

#### Creating a verification signature:

$signatureTest = base64\_encode(hash\_hmac('sha1', $\_POST['result'], API\_SECRET));

## SMS

information about incoming SMS messages

#### Parameters that are sent to link for notifications:

* **event** – event (SMS)
* **result** – array;
  + **caller\_id** – senders number;
  + **caller\_did** – receivers number;
  + **text** – message text.

#### Creating a verification signature:

$signatureTest = base64\_encode(hash\_hmac('sha1', $\_POST['result'], API\_SECRET));

## SPEECH\_RECOGNITION

speech recognition result

**Parameters that are sent to the link for notifications:**

* **event** – event (SPEECH\_RECOGNITION)
* **lang** – language;
* **call\_id** – unique call ID, it is specified in the name of the file with the call recording;
* **pbx\_call\_id** – permanent ID of the external call to the PBX;
* **result:**
  + **words** - array:
    - **result** - list of words (array):
      * **s** - word beginning time
      * **e** - word ending time
      * **w** - word
    - **channel** - channel number
  + **phrases** - array:
    - **result** - phrase
    - **channel** - channel number

## DOCUMENT

information on document verification

```
                                    {
    "wrong_document": {
        "user_id":1234567,
        "group_id":0,
        "document_type":"passport",
        "message":"The documents you have uploaded cannot be accepted because of low image quality."
    }
}
```

#### Parameters that are sent to the notification URL:

* **event** – event (DOCUMENT);
* **result** – verification result in JSON format;

## PHP example:

```
                                    <?php if (isset($_GET['zd_echo'])) exit($_GET['zd_echo']); ?>
```

For security reasons, we recommend you to allow access to your link only from the following IP: **185.45.152.40/30**.

If you have issued [the keys for access to the API](https://my.zadarma.com/api/), each request will receive an additional header **"Signature"**, which can be used to compare data consistency and authenticity.

You can see a script example in [our repository on GitHub](https://github.com/zadarma/user-api-v1/blob/master/examples/index.php).

