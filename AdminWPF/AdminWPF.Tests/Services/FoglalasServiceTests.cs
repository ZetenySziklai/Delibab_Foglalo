using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using AdminWPF.Models;
using AdminWPF.Services;
using NUnit.Framework;
using RichardSzalay.MockHttp;

namespace AdminWPF.Tests.Services;

[TestFixture]
public class FoglalasServiceTests
{
    private static HttpClient CreateClient(MockHttpMessageHandler mock)
    {
        var client = mock.ToHttpClient();
        client.BaseAddress = new Uri("http://localhost");
        return client;
    }

    [Test]
    public async Task GetFoglalasokAsync_SikeresValasz_VisszaadjaAFoglalasokat()
    {
        var foglalasok = new List<Foglalas>
        {
            new() { Id = 1, FelhasznaloId = 10, AsztalId = 2, IdopontId = 3, FoglaiasDatum = "2025-06-01" },
            new() { Id = 2, FelhasznaloId = 11, AsztalId = 4, IdopontId = 1, FoglaiasDatum = "2025-06-02" }
        };
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/foglalasok").Respond(HttpStatusCode.OK, JsonContent.Create(foglalasok));
        var service = new FoglalasService(CreateClient(mockHttp));

        var eredmeny = await service.GetFoglalasokAsync();

        Assert.That(eredmeny, Has.Count.EqualTo(2));
        Assert.That(eredmeny[0].Id, Is.EqualTo(1));
        Assert.That(eredmeny[1].FelhasznaloId, Is.EqualTo(11));
    }

    [Test]
    public async Task GetFoglalasokAsync_UresValasz_VisszaadUresLista()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/foglalasok").Respond(HttpStatusCode.OK, JsonContent.Create(new List<Foglalas>()));
        var service = new FoglalasService(CreateClient(mockHttp));

        var eredmeny = await service.GetFoglalasokAsync();

        Assert.That(eredmeny, Is.Empty);
    }

    [Test]
    public async Task GetFoglalasokAsync_HalozatiHiba_VisszaadUresLista()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/foglalasok").Throw(new HttpRequestException("Kapcsolat elutasítva"));
        var service = new FoglalasService(CreateClient(mockHttp));

        var eredmeny = await service.GetFoglalasokAsync();

        Assert.That(eredmeny, Is.Empty);
    }

    [Test]
    public async Task GetFoglalasiAdatokAsync_SikeresValasz_VisszaadjaAzAdatokat()
    {
        var adatok = new List<FoglalasiAdatokValasz>
        {
            new() { Id = 1, FoglalasId = 10, Felnott = 2, Gyerek = 1, Megjegyzes = "Születésnap" },
            new() { Id = 2, FoglalasId = 11, Felnott = 4, Gyerek = 0 }
        };
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/foglalasi-adatok").Respond(HttpStatusCode.OK, JsonContent.Create(adatok));
        var service = new FoglalasService(CreateClient(mockHttp));

        var eredmeny = await service.GetFoglalasiAdatokAsync();

        Assert.That(eredmeny, Has.Count.EqualTo(2));
        Assert.That(eredmeny[0].Megjegyzes, Is.EqualTo("Születésnap"));
        Assert.That(eredmeny[1].Felnott, Is.EqualTo(4));
    }

    [Test]
    public async Task GetFoglalasiAdatokAsync_HalozatiHiba_VisszaadUresLista()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/foglalasi-adatok").Throw(new HttpRequestException("Hiba"));
        var service = new FoglalasService(CreateClient(mockHttp));

        var eredmeny = await service.GetFoglalasiAdatokAsync();

        Assert.That(eredmeny, Is.Empty);
    }

    [Test]
    public async Task CreateFoglalasAsync_MindketPostSikeres_NullalTer()
    {
        var ujFoglalas = new Foglalas { Id = 42, FelhasznaloId = 1, AsztalId = 2, IdopontId = 3 };
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Post, "http://localhost/api/foglalasok").Respond(HttpStatusCode.Created, JsonContent.Create(ujFoglalas));
        mockHttp.When(HttpMethod.Post, "http://localhost/api/foglalasi-adatok").Respond(HttpStatusCode.Created);
        var service = new FoglalasService(CreateClient(mockHttp));

        var hiba = await service.CreateFoglalasAsync(
            new FoglalasLetrehozas { FelhasznaloId = 1, AsztalId = 2, IdopontId = 3, FoglaiasDatum = "2025-07-01T12:00:00Z" },
            new FoglalasiadatokLetrehozas { Felnott = 2, Gyerek = 0, FoglaiasDatum = "2025-07-01T12:00:00Z" });

        Assert.That(hiba, Is.Null);
    }

    [Test]
    public async Task CreateFoglalasAsync_FoglalasLetrehozasSikertelen_HibaSzovegetAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Post, "http://localhost/api/foglalasok")
            .Respond(HttpStatusCode.Conflict, "application/json", "{\"message\":\"Az asztal már foglalt\"}");
        var service = new FoglalasService(CreateClient(mockHttp));

        var hiba = await service.CreateFoglalasAsync(new FoglalasLetrehozas(), new FoglalasiadatokLetrehozas());

        Assert.That(hiba, Is.Not.Null);
        Assert.That(hiba, Does.Contain("Az asztal már foglalt"));
    }

    [Test]
    public async Task CreateFoglalasAsync_AdatokMenteseSikertelen_RollbackEsHibaSzoveg()
    {
        var ujFoglalas = new Foglalas { Id = 99 };
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Post, "http://localhost/api/foglalasok").Respond(HttpStatusCode.Created, JsonContent.Create(ujFoglalas));
        mockHttp.When(HttpMethod.Post, "http://localhost/api/foglalasi-adatok")
            .Respond(HttpStatusCode.BadRequest, "application/json", "{\"error\":\"Hiányzó mező\"}");
        mockHttp.When(HttpMethod.Delete, "http://localhost/api/foglalasok/99").Respond(HttpStatusCode.OK);
        var service = new FoglalasService(CreateClient(mockHttp));

        var hiba = await service.CreateFoglalasAsync(new FoglalasLetrehozas(), new FoglalasiadatokLetrehozas());

        Assert.That(hiba, Is.Not.Null);
        Assert.That(hiba, Does.Contain("Hiányzó mező"));
    }

    [Test]
    public async Task CreateFoglalasAsync_HalozatiHiba_KivetelSzovegetAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Post, "http://localhost/api/foglalasok").Throw(new HttpRequestException("Timeout"));
        var service = new FoglalasService(CreateClient(mockHttp));

        var hiba = await service.CreateFoglalasAsync(new FoglalasLetrehozas(), new FoglalasiadatokLetrehozas());

        Assert.That(hiba, Is.Not.Null);
        Assert.That(hiba, Does.StartWith("Kivétel:"));
    }

    [Test]
    public async Task DeleteFoglalasAsync_MindketTorlesSikeres_NullalTer()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Delete, "http://localhost/api/foglalasi-adatok/20").Respond(HttpStatusCode.OK);
        mockHttp.When(HttpMethod.Delete, "http://localhost/api/foglalasok/10").Respond(HttpStatusCode.OK);
        var service = new FoglalasService(CreateClient(mockHttp));

        var hiba = await service.DeleteFoglalasAsync(foglalasId: 10, foglalasiAdatokId: 20);

        Assert.That(hiba, Is.Null);
    }

    [Test]
    public async Task DeleteFoglalasAsync_CsakFoglalasTorles_NullalTer()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Delete, "http://localhost/api/foglalasok/5").Respond(HttpStatusCode.OK);
        var service = new FoglalasService(CreateClient(mockHttp));

        var hiba = await service.DeleteFoglalasAsync(foglalasId: 5);

        Assert.That(hiba, Is.Null);
    }

    [Test]
    public async Task DeleteFoglalasAsync_FoglalasiAdatokMar404_FoglalastMegisTorol()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Delete, "http://localhost/api/foglalasi-adatok/30").Respond(HttpStatusCode.NotFound);
        mockHttp.When(HttpMethod.Delete, "http://localhost/api/foglalasok/15").Respond(HttpStatusCode.OK);
        var service = new FoglalasService(CreateClient(mockHttp));

        var hiba = await service.DeleteFoglalasAsync(foglalasId: 15, foglalasiAdatokId: 30);

        Assert.That(hiba, Is.Null);
    }

    [Test]
    public async Task DeleteFoglalasAsync_FoglalasTorlesSikertelen_HibaSzovegetAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Delete, "http://localhost/api/foglalasok/7")
            .Respond(HttpStatusCode.Forbidden, "application/json", "{\"message\":\"Nincs jogosultság\"}");
        var service = new FoglalasService(CreateClient(mockHttp));

        var hiba = await service.DeleteFoglalasAsync(foglalasId: 7);

        Assert.That(hiba, Is.Not.Null);
        Assert.That(hiba, Does.Contain("Nincs jogosultság"));
    }

    [Test]
    public async Task DeleteFoglalasAsync_HalozatiHiba_KivetelSzovegetAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Delete, "http://localhost/api/foglalasok/8").Throw(new HttpRequestException("Szerver nem elérhető"));
        var service = new FoglalasService(CreateClient(mockHttp));

        var hiba = await service.DeleteFoglalasAsync(foglalasId: 8);

        Assert.That(hiba, Is.Not.Null);
        Assert.That(hiba, Does.StartWith("Kivétel:"));
    }
}
