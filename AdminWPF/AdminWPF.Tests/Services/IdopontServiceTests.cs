using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using AdminWPF.Models;
using AdminWPF.Services;
using NUnit.Framework;
using RichardSzalay.MockHttp;

namespace AdminWPF.Tests.Services;

[TestFixture]
public class IdopontServiceTests
{
    private static HttpClient CreateClient(MockHttpMessageHandler mock)
    {
        var client = mock.ToHttpClient();
        client.BaseAddress = new Uri("http://localhost");
        return client;
    }

    [Test]
    public async Task GetIdopontokAsync_SikeresValasz_VisszaadjaAzIdopontokat()
    {
        var idopontok = new List<Idopont>
        {
            new() { Id = 1, Kezdet = 9.0,  Veg = 10.0 },
            new() { Id = 2, Kezdet = 10.5, Veg = 12.0 }
        };
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/idopontok").Respond(HttpStatusCode.OK, JsonContent.Create(idopontok));
        var service = new IdopontService(CreateClient(mockHttp));

        var eredmeny = await service.GetIdopontokAsync();

        Assert.That(eredmeny, Has.Count.EqualTo(2));
        Assert.That(eredmeny[0].Kezdet, Is.EqualTo(9.0));
        Assert.That(eredmeny[1].Veg, Is.EqualTo(12.0));
    }

    [Test]
    public async Task GetIdopontokAsync_UresValasz_VisszaadUresLista()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/idopontok").Respond(HttpStatusCode.OK, JsonContent.Create(new List<Idopont>()));
        var service = new IdopontService(CreateClient(mockHttp));

        var eredmeny = await service.GetIdopontokAsync();

        Assert.That(eredmeny, Is.Empty);
    }

    [Test]
    public async Task GetIdopontokAsync_HalozatiHiba_VisszaadUresLista()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/idopontok").Throw(new HttpRequestException("Szerver nem elérhető"));
        var service = new IdopontService(CreateClient(mockHttp));

        var eredmeny = await service.GetIdopontokAsync();

        Assert.That(eredmeny, Is.Empty);
    }

    [Test]
    public async Task CreateIdopontAsync_SikeresLetrehozas_IgazatAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Post, "http://localhost/api/idopontok").Respond(HttpStatusCode.Created);
        var service = new IdopontService(CreateClient(mockHttp));

        var eredmeny = await service.CreateIdopontAsync(new IdopontLetrehozas { Kezdet = 8.0, Veg = 9.0 });

        Assert.That(eredmeny, Is.True);
    }

    [Test]
    public async Task CreateIdopontAsync_Konfliktus_HamisatAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Post, "http://localhost/api/idopontok").Respond(HttpStatusCode.Conflict);
        var service = new IdopontService(CreateClient(mockHttp));

        var eredmeny = await service.CreateIdopontAsync(new IdopontLetrehozas { Kezdet = 9.0, Veg = 10.0 });

        Assert.That(eredmeny, Is.False);
    }

    [Test]
    public async Task CreateIdopontAsync_HalozatiHiba_HamisatAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Post, "http://localhost/api/idopontok").Throw(new HttpRequestException("Timeout"));
        var service = new IdopontService(CreateClient(mockHttp));

        var eredmeny = await service.CreateIdopontAsync(new IdopontLetrehozas { Kezdet = 14.0, Veg = 15.5 });

        Assert.That(eredmeny, Is.False);
    }

    [Test]
    public async Task DeleteIdopontAsync_LetezoIdopont_IgazatAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Delete, "http://localhost/api/idopontok/3").Respond(HttpStatusCode.OK);
        var service = new IdopontService(CreateClient(mockHttp));

        var eredmeny = await service.DeleteIdopontAsync(3);

        Assert.That(eredmeny, Is.True);
    }

    [Test]
    public async Task DeleteIdopontAsync_NemLetezoIdopont_HamisatAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Delete, "http://localhost/api/idopontok/999").Respond(HttpStatusCode.NotFound);
        var service = new IdopontService(CreateClient(mockHttp));

        var eredmeny = await service.DeleteIdopontAsync(999);

        Assert.That(eredmeny, Is.False);
    }

    [Test]
    public async Task DeleteIdopontAsync_HalozatiHiba_HamisatAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Delete, "http://localhost/api/idopontok/2").Throw(new HttpRequestException("Kapcsolat megszakadt"));
        var service = new IdopontService(CreateClient(mockHttp));

        var eredmeny = await service.DeleteIdopontAsync(2);

        Assert.That(eredmeny, Is.False);
    }

    [TestCase(9.0,   "09:00")]
    [TestCase(6.5,   "06:30")]
    [TestCase(10.25, "10:15")]
    [TestCase(13.75, "13:45")]
    [TestCase(0.0,   "00:00")]
    public void DoubleToIdo_KulonbozdErtekek_HelyCimkeHelyes(double ertek, string elvart)
    {
        Assert.That(Idopont.DoubleToIdo(ertek), Is.EqualTo(elvart));
    }

    [Test]
    public void Idopont_ToString_MutatjaAKezdetEsVeget()
    {
        var idopont = new Idopont { Id = 1, Kezdet = 9.0, Veg = 10.5 };
        Assert.That(idopont.ToString(), Is.EqualTo("09:00 - 10:30"));
    }
}
