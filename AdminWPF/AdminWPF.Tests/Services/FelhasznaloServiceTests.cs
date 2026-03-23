using System.Net;
using System.Net.Http;
using AdminWPF.Services;
using NUnit.Framework;
using RichardSzalay.MockHttp;

namespace AdminWPF.Tests.Services;

[TestFixture]
public class FelhasznaloServiceTests
{
    private static HttpClient CreateClient(MockHttpMessageHandler mock)
    {
        var client = mock.ToHttpClient();
        client.BaseAddress = new Uri("http://localhost");
        return client;
    }

    [Test]
    public async Task GetFelhasznalokAsync_SikeresValasz_VisszaadjaAFelhasznalokat()
    {
        var json = """
            [
              {"id":1,"vezeteknev":"Kiss","keresztnev":"Béla","email":"kiss@test.hu","isAdmin":true},
              {"id":2,"vezeteknev":"Nagy","keresztnev":"Anna","email":"nagy@test.hu","isAdmin":false}
            ]
            """;
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/users").Respond(HttpStatusCode.OK, "application/json", json);
        var service = new FelhasznaloService(CreateClient(mockHttp));

        var eredmeny = await service.GetFelhasznalokAsync();

        Assert.That(eredmeny, Has.Count.EqualTo(2));
        Assert.That(eredmeny[0].Vezeteknev, Is.EqualTo("Kiss"));
        Assert.That(eredmeny[0].IsAdmin, Is.True);
        Assert.That(eredmeny[1].Email, Is.EqualTo("nagy@test.hu"));
        Assert.That(eredmeny[1].IsAdmin, Is.False);
    }

    [Test]
    public async Task GetFelhasznalokAsync_IsAdminSzamKent1_IsAdminIgaz()
    {
        var json = """[{"id":3,"vezeteknev":"Tóth","keresztnev":"Géza","email":"toth@test.hu","isAdmin":1}]""";
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/users").Respond(HttpStatusCode.OK, "application/json", json);
        var service = new FelhasznaloService(CreateClient(mockHttp));

        var eredmeny = await service.GetFelhasznalokAsync();

        Assert.That(eredmeny[0].IsAdmin, Is.True);
    }

    [Test]
    public async Task GetFelhasznalokAsync_IsAdminSzamKent0_IsAdminHamis()
    {
        var json = """[{"id":4,"vezeteknev":"Varga","keresztnev":"Éva","email":"varga@test.hu","isAdmin":0}]""";
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/users").Respond(HttpStatusCode.OK, "application/json", json);
        var service = new FelhasznaloService(CreateClient(mockHttp));

        var eredmeny = await service.GetFelhasznalokAsync();

        Assert.That(eredmeny[0].IsAdmin, Is.False);
    }

    [Test]
    public async Task GetFelhasznalokAsync_UresLista_VisszaadUresLista()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/users").Respond(HttpStatusCode.OK, "application/json", "[]");
        var service = new FelhasznaloService(CreateClient(mockHttp));

        var eredmeny = await service.GetFelhasznalokAsync();

        Assert.That(eredmeny, Is.Empty);
    }

    [Test]
    public async Task GetFelhasznalokAsync_HalozatiHiba_VisszaadUresLista()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/users").Throw(new HttpRequestException("DNS hiba"));
        var service = new FelhasznaloService(CreateClient(mockHttp));

        var eredmeny = await service.GetFelhasznalokAsync();

        Assert.That(eredmeny, Is.Empty);
    }

    [Test]
    public async Task GetFelhasznalokAsync_401Unauthorized_NemDobKivetelt()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/users").Respond(HttpStatusCode.Unauthorized);
        var service = new FelhasznaloService(CreateClient(mockHttp));

        Assert.DoesNotThrowAsync(async () => await service.GetFelhasznalokAsync());
    }

    [Test]
    public void Felhasznalo_TeljesNev_VezeteknEvEsKeresztnev()
    {
        var f = new Felhasznalo { Vezeteknev = "Kovács", Keresztnev = "Péter" };
        Assert.That(f.TeljesNev, Is.EqualTo("Kovács Péter"));
    }

    [Test]
    public void Felhasznalo_ToString_TartalmazzaAzEmailt()
    {
        var f = new Felhasznalo { Vezeteknev = "Balogh", Keresztnev = "Zsuzsanna", Email = "balogh@pelda.hu" };
        Assert.That(f.ToString(), Does.Contain("balogh@pelda.hu"));
    }
}
